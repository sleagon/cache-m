# Memory Cache Middleware for Cache Suite.

This is simple middleware for cache suite.

## Usage

```js
  const cache = new Cache<number>();
  const handler1 = new MemCache(100, 'first');
  const handler2 = new MemCache(100, 'second');

  // first
  cache.use(handler1);
  // second
  cache.use(handler2);

  // without data
  await cache.set('hello', 200);
  let v = await cache.get('hello');
  // >> 200
  let ctx: Context<number> = { key: 'hello' };
  await cache.getContext(ctx);
  // >> { key: 'hello', body: 200, source: 'first' }
```
