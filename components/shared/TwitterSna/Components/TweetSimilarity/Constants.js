export const Consts = {
  STATUS_LINK: "https://twitter.com/dummy/status/", //append status_id
  USER_LINK: "https://twitter.com/", //append user handle
};

// export default Consts;

export function getFreq(arr) {
  const map = arr.reduce(
    (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map()
  );
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function getFreqInDiv(listOrCommaSepStr) {
  if (
    typeof listOrCommaSepStr === "string" ||
    listOrCommaSepStr instanceof String
  ) {
    listOrCommaSepStr = listOrCommaSepStr.split(",").map(item => item.trim());
  }
  const freqs = getFreq(listOrCommaSepStr);
  const res = freqs.map((item) => (
    <div key={item[0]}>
        {item[0] + "(" + item[1] + "), "}
    </div>
  ));
  return res;
}

/**
 * Gets a list or a comma separated string and converts them to a html link embeded in a div.
 * @param {*} listOrCommaSepStr
 * @param {*} linkPrefix href of the link
 * @returns
 */
export function addLinkToEachItem(listOrCommaSepStr, linkPrefix) {
  //if it is a string, then separate by comma
  if (
    typeof listOrCommaSepStr === "string" ||
    listOrCommaSepStr instanceof String
  ) {
    listOrCommaSepStr = listOrCommaSepStr.split(",").map(item => item.trim());
  }
  const freqs = getFreq(listOrCommaSepStr);
  const res = freqs.map((item) => (
    <div key={item[0]}>
      <a href={linkPrefix + item[0]} target="_blank" rel="noopener noreferrer">
        {item[0] + "(" + item[1] + "), "}
      </a>
    </div>
  ));
  return res;
}
