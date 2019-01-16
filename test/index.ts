import Cache, { Context } from 'cache-suite';
import MemCache from '../src';

import { expect } from 'chai';

describe('Stack', () => {
  it('single memory cacher', async () => {
    const cache = new Cache<number>();
    const memCache = new MemCache<number>();
    cache.use(memCache);

    // test
    await cache.set('hello', 200);
    const v = await cache.get('hello');
    expect(v).to.equal(200);
  });

  it('single memory cacher with source', async () => {
    const cache = new Cache<number>();
    const memCache = new MemCache<number>(100, 'test');
    cache.use(memCache);

    // test
    await cache.set('hello', 200);
    const v = await cache.get('hello');
    expect(v).to.equal(200);
    // ctx
    const ctx: Context<number> = { key: 'hello' };
    await cache.getContext(ctx);
    expect(ctx.source).to.equal('test');
  });

  it('should get data from the first middleware.', async () => {
    const cache = new Cache<number>();
    const handler1 = new MemCache(100, 'first');
    const handler2 = new MemCache(100, 'second');

    // first
    cache.use(handler1);
    // second
    cache.use(handler2);

    // without data
    let v = await cache.get('hello');
    expect(v).to.equal(undefined);
    let ctx: Context<number> = { key: 'hello' };
    await cache.getContext(ctx);
    expect(ctx.source).to.equal(undefined);
    expect(ctx.body).to.equal(undefined);

    // set data
    await cache.set('hello', 200);
    v = await cache.get('hello');
    expect(v).to.equal(200);
    ctx = { key: 'hello' };
    await cache.getContext(ctx);
    expect(ctx.source).to.equal('first');
    expect(ctx.body).to.equal(200);
  });
});
