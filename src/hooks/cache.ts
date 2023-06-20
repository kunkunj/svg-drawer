export const createCache = () => {
  let CacheQueue: CacheQueueType = [];
  const EnterCache = (context: any) => {
    CacheQueue.pop();
    CacheQueue.unshift(context);
  };
  const OutCache = () => {
    CacheQueue.shift();
    CacheQueue.push(0);
  };
  const initCache = (cache: number) => {
    CacheQueue = new Array(cache).map(() => 0);
  };
  return {
    CacheQueue,
    initCache,
    EnterCache,
    OutCache,
  };
};
