#!/usr/bin/env bash
# Deploys the API + worker on the Lightsail server. Run on the server, from the repo
# checkout (~/pdftool). GitHub Actions invokes it over SSH; it can also be run by hand.
#
#   1. Tag the running images as :rollback and remember the current commit
#   2. Fast-forward to origin/main
#   3. Build new images (old containers keep serving while this runs)
#   4. Recreate api + worker, wait for /health
#   5. If the new version doesn't come up healthy, restore the previous images and
#      commit, and exit non-zero so the pipeline fails loudly.
#
# Everything lives inside main() so bash parses the whole script before running it —
# `git pull` below may rewrite this very file.

main() {
  set -euo pipefail

  local repo_dir="${DEPLOY_DIR:-$HOME/pdftool}"
  local branch="${DEPLOY_BRANCH:-main}"
  local health_url="http://127.0.0.1:3001/api/v1/health"
  local services=(api worker)

  cd "$repo_dir"
  log() { echo "[deploy $(date -u +%H:%M:%S)] $*"; }

  # Only one deploy at a time, even if two pushes land back to back.
  exec 9>"$repo_dir/.deploy.lock"
  flock -n 9 || { log "another deploy is running — aborting"; exit 1; }

  local prev_commit
  prev_commit="$(git rev-parse HEAD)"
  log "current commit: ${prev_commit:0:7}"

  for svc in "${services[@]}"; do
    docker image inspect "pdftool-$svc" >/dev/null 2>&1 && docker tag "pdftool-$svc" "pdftool-$svc:rollback"
  done

  git fetch --quiet origin "$branch"

  # Files that exist here untracked but are tracked upstream (e.g. a Dockerfile first
  # created by hand on the server) would block the merge — keep a copy and move them aside.
  local f
  while IFS= read -r f; do
    if [ -e "$f" ] && ! git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
      mkdir -p ".deploy-backup/$(dirname "$f")"
      mv "$f" ".deploy-backup/$f"
      log "moved untracked $f to .deploy-backup/ (now tracked in git)"
    fi
  done < <(git diff --name-only HEAD "origin/$branch")

  if ! git merge --ff-only --quiet "origin/$branch"; then
    log "server checkout has diverged from origin/$branch — resolve by hand"; exit 1
  fi
  local new_commit
  new_commit="$(git rev-parse HEAD)"
  log "deploying ${new_commit:0:7}: $(git log -1 --format=%s)"

  log "building images…"
  docker compose build --quiet "${services[@]}"

  log "restarting ${services[*]}…"
  docker compose up -d --no-deps "${services[@]}"

  if wait_healthy "$health_url"; then
    log "healthy ✓  deployed ${new_commit:0:7}"
    docker image prune -f >/dev/null || true
    exit 0
  fi

  log "new version is NOT healthy — rolling back to ${prev_commit:0:7}"
  docker compose logs --tail=40 api worker || true
  git reset --quiet --hard "$prev_commit"
  for svc in "${services[@]}"; do
    docker image inspect "pdftool-$svc:rollback" >/dev/null 2>&1 && docker tag "pdftool-$svc:rollback" "pdftool-$svc"
  done
  docker compose up -d --no-deps --no-build "${services[@]}"
  if wait_healthy "$health_url"; then
    log "rolled back; previous version is serving again"
  else
    log "ROLLBACK ALSO UNHEALTHY — needs manual attention"
  fi
  exit 1
}

wait_healthy() {
  local url="$1"
  for _ in $(seq 1 60); do
    curl -fsS --max-time 3 "$url" >/dev/null 2>&1 && return 0
    sleep 2
  done
  return 1
}

main "$@"
