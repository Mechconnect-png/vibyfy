let timer = null;

export const startSleepTimer = (minutes, callback) => {
  clearSleepTimer();

  timer = setTimeout(() => {
    callback?.();
  }, minutes * 60 * 1000);
};

export const clearSleepTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

export const hasSleepTimer = () => {
  return timer !== null;
};