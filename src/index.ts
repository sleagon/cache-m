'use strict';

import LRU from 'lru-cache';
import { Context, Handler } from 'cache-suite';

export default class MemoryCache<T> implements Handler<T> {
  private lru: LRU.Cache<string, T>;
  private name: string;
  get source() {
    return this.name;
  }
  constructor(size: number = 500, name: string = 'MEM-CACHE') {
    this.lru = LRU<string, T>(size);
    this.name = name;
  }
  async get(ctx: Context<T>, next?: () => Promise<void>): Promise<void> {
    if (!ctx.key || ctx.body) {
      return;
    }
    const body = this.lru.get(ctx.key);
    if (body) {
      ctx.body = body;
      ctx.source = this.source;
      return;
    }
    await next();
    this.cacheData(ctx);
  }
  cacheData(ctx) {
    if (ctx.body) {
      this.lru.set(ctx.key, ctx.body);
    }
  }
  async set(ctx, next) {
    if (!ctx.key || !ctx.body) {
      return;
    }
    // cache to lru & call next
    this.cacheData(ctx);
    await next();
  }
}
