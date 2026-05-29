/**
 * 分片执行大任务，避免阻塞主线程
 * @param data 任务数据（数字表示执行次数，数组则遍历处理）
 * @param taskHandler 每项任务的处理函数
 * @param scheduler 调度器，控制任务执行时机
 */
export const performChunk = (
  data: number | any[],
  taskHandler: (item: any, index: number) => void,
  scheduler: (run: (goOn: () => boolean) => void) => void,
): void => {
  const arr: any[] = typeof data === "number" ? new Array(data).fill(data) : data;
  if (arr.length === 0) return;

  let i = 0;
  function _run() {
    if (i === arr.length) return;
    scheduler((goOn) => {
      while (goOn() && i < arr.length) {
        taskHandler(arr[i], i);
        i++;
      }
      _run();
    });
  }
  _run();
};

/**
 * 并发请求控制
 * @param urls 请求 URL 集合
 * @param maxNum 最大并发数，默认 3
 */
export const concurRequest = (urls: string[] = [], maxNum: number = 3): Promise<Response[]> => {
  return new Promise((resolve) => {
    if (urls.length === 0) {
      resolve([]);
      return;
    }
    let nextIndex = 0;
    let finishCount = 0;
    const result: Response[] = [];

    function _request() {
      if (nextIndex >= urls.length) return;
      const i = nextIndex;
      const url = urls[nextIndex++];
      fetch(url).then((resp) => {
        result[i] = resp;
        finishCount++;
        if (finishCount === urls.length) {
          resolve(result);
        }
        _request();
      });
    }
    for (let i = 0; i < Math.min(maxNum, urls.length); i++) {
      _request();
    }
  });
};
