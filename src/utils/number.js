export function numberFormatter(n, digits, formatAll = false, useNegatives = false) {
  const num = Number.isNaN(Number(n)) ? 0 : Number(n);

  if (num > 1000000 || formatAll) {
    const si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    if (num < 0) {
      // abs(-1)
      const numCon = Math.abs(num);
      for (i = si.length - 1; i > 0; i--) {
        if (numCon >= si[i].value) {
          break;
        }
      }

      if (useNegatives) {
        return `-${(numCon / si[i].value).toFixed(digits).replace(rx, "") + si[i].symbol}`;
      }
      return `(${(numCon / si[i].value).toFixed(digits).replace(rx, "") + si[i].symbol})`;
    }
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "") + si[i].symbol;
  }

  const isNegative = Number(num) < 0;

  const numString = isNegative
    ? `(${Math.abs(num || 0)
        .toFixed(digits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`
    : num?.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0.0;

  return numString;
}
