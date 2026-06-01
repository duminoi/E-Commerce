import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: any) {}

  async get(key: string): Promise<string | null> {
    try { return await this.redis.get(key); } catch { return null; }
  }

  async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    try { await this.redis.set(key, value, 'EX', ttlSeconds); } catch {}
  }

  async del(key: string): Promise<void> {
    try { await this.redis.del(key); } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
    } catch {}
  }
}
