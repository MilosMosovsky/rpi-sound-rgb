export function fadeNumberTo(from, to, cb = () => {}, interval = 500, step = 20) {
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

export function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

export function averageArray(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);

  return sum / arr.length;
}

export function analyze(data, history) {
    const avgCurrent = averageArray(data);
    const avgHistory = averageArray(history);

    // console.log('average amount of history', avgHistory);
    // console.log('average ammount current', avgCurrent);

    const percentage = avgCurrent / avgHistory;
    return percentage < 1 ? percentage : 1;
}
