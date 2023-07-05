export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

export function stringToList(string) {
  let newStr = string.replace(/@/g, " ");
  let res = newStr.split(" ");
  return res.filter(function (el) {
    return el !== "";
  });
}

export function getLabelsColumns(keyword, columns) {
  const labeledColumns = columns.map((obj, index) => {
    return { ...obj, title: keyword(obj.title) };
  });
  return labeledColumns;
}
