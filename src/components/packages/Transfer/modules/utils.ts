export function getFilteredData<T extends { label: string }>(
  data: T[],
  searchValue: string,
): T[] {
  return data.filter(item => {
    const itemLabel = item.label.toLowerCase();
    if (!searchValue.trim().length) return true;
    return itemLabel.includes(searchValue.toLowerCase());
  });
}

export function filterDataByKeys<T extends { key: string | number }>(
  data: T[],
  keys: (string | number)[],
  field: 'selected' | 'unselected' = 'selected'
): T[] {
  if (field === 'unselected') {
    return data.filter(item => keys.every(key => key !== item.key));
  }
  return data.filter(item => keys.some(key => key === item.key));
}

export function addElementToArray<T>(result: T[], value: T | T[]) {
  if (Array.isArray(value)) {
    for (let item of value) {
      if (result.includes(item)) continue;
      result.push(item);
    }
  } else {
    if (result.includes(value)) return;
    result.push(value);
  }
  return result;
}

export function removeElementFromArray<T>(result: T[], value: T | T[]) {
  let newResult: T[] = [];
  if (Array.isArray(value)) {
    newResult = result.filter((item) => !value.includes(item));
  } else {
    newResult = result.filter((item) => item !== value);
  }
  return newResult;
}
