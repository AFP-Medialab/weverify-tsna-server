const includeWordObj = (wordObj, wordsArray) => {
  console.log("wordObj ", wordObj)
  console.log("wordsArray ", wordsArray)

  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i] === wordObj) return i;
  }
  return -1;
};

function getnMax(objArr, n) {
  let sorted = [...objArr.sort((a, b) => b.nbOccurences - a.nbOccurences)];
  console.log(sorted)
  return sorted.splice(0, n);
}

const getAllWordsMap = (elasticResponse/*, request*/) => {
  console.log("elasticResponse ",elasticResponse)

  let hits = Array.from(elasticResponse);
  console.log("hits ",hits)

  let wordsMap = []
  let wordss=[]
  let coHashtagArr1 = hits.filter(tweet => tweet.description !== undefined && tweet.description !==null)
  .map((tweet) => { return tweet.description });
  
  
  for (var i=0 ;i<coHashtagArr1.length; i++){
    var intermediate=coHashtagArr1[i].split(' ')
    for (var j=0; j<intermediate.length; j++){
      intermediate[j] = intermediate[j].replace(/[^@#A-Za-z0-9]/g, '');
      if(intermediate[j].length>0 && intermediate[j]!==" "){
        wordss.push(intermediate[j])
      }
    }
  }
  var post=[]

  if(hits.url !=null || hits.url !=undefined) {
    post=hits.url
    }
  let obj = {
    ceva: "ceva", 
    userIsMentioned: '1',
    total_interactions: hits.total_interactions,
    post:post
  }
  return obj;

 
  console.log("wordss  ",wordss)
  
 
  var arr = wordss
  arr.forEach((word) => {
    let j = includeWordObj(word, wordsMap);
    if (j !== -1) {
      wordsMap[j].nbOccurences += word.nbOccurences;
    } else {
      wordsMap.push(word);
    }
    console.log("wordsMap ",wordsMap)
  });

  /*
  let toRemove = request.keywordList.map((word) => word.replace("#", ""));

  toRemove.forEach((wordToRemove) => {
    wordsMap.splice(includeWordObj(wordToRemove, wordsMap), 1);
  });
  */
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

export const createWordCloud = (plotlyJson/*, request*/) => {
  let mostUsedWords = getAllWordsMap(plotlyJson/*, request*/);
  console.log("mostUsedWords ", mostUsedWords)
  mostUsedWords = mostUsedWords.map((word) => {
    //let w = word.includes("@") ? word : word.replace(/_/g, " ");
    return {
      text: word,
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
    fontSizes: [15, 80],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [15, -15],
    scale: "sqrt",
    spiral: "rectangular",
    transitionDuration: 1000,
  };

  return {
    json: mostUsedWords,
    options: options,
  };
};
