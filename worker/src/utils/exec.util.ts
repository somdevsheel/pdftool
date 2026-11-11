import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface ExecResult {
  stdout: string;
  stderr: string;
}

// Runs a binary directly with an argument array — never through a shell — so
// user-supplied values (page ranges, passwords, file names) can't be interpreted
// as shell syntax. Never build a command string and split it; pass each argument
// as its own array element.
export async function runCommand(
  file: string,
  args: string[],
  timeoutMs = 120_000,
): Promise<ExecResult> {
  try {
    return await execFileAsync(file, args, { timeout: timeoutMs, maxBuffer: 20 * 1024 * 1024 });
  } catch (err: any) {
    // qpdf exits with code 3 for warnings — output is still valid
    if (err.code === 3) {
      return { stdout: err.stdout || '', stderr: err.stderr || '' };
    }
    const msg = err.stderr || err.stdout || err.message || 'Command failed';
    throw new Error(`Command failed: ${String(msg).trim()}`);
  }
}

export async function checkToolAvailable(tool: string): Promise<boolean> {
  try {
    await execFileAsync('which', [tool]);
    return true;
  } catch {
    return false;
  }
}
