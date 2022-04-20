addEventListener('message', event =>{
  console.log("cloud chart worker on message")
  postMessage(createWordCloud(event.data[0], event.data[1]))
})

const includeWordObj = (wordObj, wordsArray) => {
  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i].word === wordObj) return i;
  }
  return -1;
};

function getnMax(objArr, n) {
  let sorted = [...objArr.sort((a, b) => b.nbOccurences - a.nbOccurences)];
  return sorted.splice(0, n);
}

const getAllWordsMap = (elasticResponse, request) => {
  let hits = Array.from(elasticResponse);
  let wordsMap = [];

  for (let i = 0; i < hits.length; i++) {
    let tweetWordsmap = hits[i]._source.wit;
    if (!(tweetWordsmap === null || tweetWordsmap === undefined)) {
      var arr = Array.from(tweetWordsmap);

      arr.forEach((word) => {
        let j = includeWordObj(word.word, wordsMap);
        if (j !== -1) {
          wordsMap[j].nbOccurences += word.nbOccurences;
        } else {
          wordsMap.push(word);
        }
      });
    }
  }
  let toRemove = request.keywordList.map((word) => word.replace("#", ""));

  toRemove.forEach((wordToRemove) => {
    wordsMap.splice(includeWordObj(wordToRemove, wordsMap), 1);
  });
  toRemove = request.keywordAnyList.map((word) => word.replace("#", ""));
  toRemove.forEach((wordToRemove) => {
    wordsMap.splice(includeWordObj(wordToRemove, wordsMap), 1);
  });
  return getnMax(wordsMap, 100);
};

function getColor(entity) {
  if (entity === "Person") return "#8242BB";
  if (entity === "Organization") return "#BB424F";
  if (entity === "UserID") return "#42BB9E";
  if (entity === "Location") return "#BB7042";

  // Get color for graph's nodes, edges
  if (entity === "Hashtag") return "#3388AA";
  if (entity === "URL") return "#9400D3";
  if (entity === "Mention" || entity === "Mention-Mention") return "#88D8B0";
  if (entity === "RetweetWC" || entity === "RetweetWC-RetweetWC")
    return "#FF6F69";
  if (entity === "Reply" || entity === "Reply-Reply") return "#FFEEAD";
  if (entity === "Hashtag-Hashtag") return "#96cce0";
  if (entity === "URL-URL") return "#CC99C9";
  if (entity === "Else-Else") return "#C0C0C0";

  return "#35347B";
}

export const createWordCloud = (plotlyJson, request) => {
  let mostUsedWords = getAllWordsMap(plotlyJson, request);
  mostUsedWords = mostUsedWords.map((word) => {
    let w = word.word.includes("@") ? word.word : word.word.replace(/_/g, " ");
    return {
      text: w,
      value: word.nbOccurences,
      entity: word.entity,
      color: getColor(word.entity),
    };
  });
  const options = {
    //  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: "impact",
    fontSizes: [15, 70],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 1,
    rotationAngles: [0, 0],
    scale: "sqrt",
    spiral: "rectangular",
    transitionDuration: 1000,
  };

  return {
    json: mostUsedWords,
    options: options,
  };
};
