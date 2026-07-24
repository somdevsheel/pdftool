// Retries only on network failures (fetch throwing) — never on HTTP error responses,
// since those are the server rejecting the request, not a transient blip.
export async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise(r => setTimeout(r, 1000 * (3 - retries)));
    return fetchWithRetry(url, options, retries - 1);
  }
}
