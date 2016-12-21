export function fadeNumberTo(from, to, cb = () => {}, interval = 500, step = 1) {
  let currentValue = from;
  const portion = (to - from) / ( interval / step);

  const timer = setInterval(() => {
    currentValue += portion;

    if (currentValue >= to) {
      currentValue = to;
      clearInterval(timer);
    }

    cb(currentValue.toFixed(2))
  }, step);
}
