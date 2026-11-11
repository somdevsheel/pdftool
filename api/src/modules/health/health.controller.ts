import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@SkipThrottle()
export class HealthController {
  // Public, so it reports liveness only — no memory/uptime details.
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
