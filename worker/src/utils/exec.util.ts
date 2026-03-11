import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export async function runCommand(
  command: string,
  timeoutMs = 120_000,
): Promise<ExecResult> {
  try {
    const result = await execAsync(command, { timeout: timeoutMs });
    return result;
  } catch (err: any) {
    // qpdf exits with code 3 for warnings — output is still valid
    if (err.code === 3) {
      return { stdout: err.stdout || '', stderr: err.stderr || '' };
    }
    const msg = err.stderr || err.stdout || err.message || 'Command failed';
    throw new Error(`Command failed: ${msg.trim()}`);
  }
}

export async function checkToolAvailable(tool: string): Promise<boolean> {
  try {
    await execAsync(`which ${tool}`);
    return true;
  } catch {
    return false;
  }
}