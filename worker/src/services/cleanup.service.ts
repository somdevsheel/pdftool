import * as fs from 'fs';
import * as path from 'path';

export class CleanupService {
  constructor(
    private readonly dirs: string[],
    private readonly expiryMinutes: number = 60,
  ) {}

  clean(): { deleted: number } {
    let deleted = 0;
    const now = Date.now();
    const expiryMs = this.expiryMinutes * 60 * 1000;

    for (const dir of this.dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile() && now - stat.mtimeMs > expiryMs) {
            fs.unlinkSync(filePath);
            deleted++;
          }
        } catch {
          // ignore
        }
      }
    }

    return { deleted };
  }

  startInterval(intervalMs = 60 * 60 * 1000): NodeJS.Timer {
    return setInterval(() => {
      const result = this.clean();
      console.log(`[Cleanup] Removed ${result.deleted} expired files`);
    }, intervalMs);
  }
}
