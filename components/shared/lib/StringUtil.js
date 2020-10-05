
export function replaceAll(str, find, replace)
{
    return str.replace( new RegExp(find, 'g'), replace );
}

export function stringToList(string) {
    let newStr = string.replace(/@/g, " ");
    let res = newStr.split(" ");
    return res.filter(function (el) {
      return el !== "";
});
}