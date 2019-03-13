export function filterInputNumber(event, value, preVal) {
  const removedTextStr = value.replace(/[^0-9.]/g, '');

  let str = removedTextStr.replace(/\./g, (val, i) => {
    if (removedTextStr.indexOf('.') !== i) val = '';
    return val
  });

  if(str === ".") str = "0.";

  event.target.value = str;

  if (preVal === str) return false;

  return true
}
