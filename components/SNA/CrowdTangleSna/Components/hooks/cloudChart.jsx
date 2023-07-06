const unique = require("unique-words");
const stopword = require("stopword");

addEventListener("message", (event) => {
  postMessage(createWordCloud(event.data));
});

function getnMax(objArr, n) {
  let sorted = [...objArr.sort((a, b) => b.nbOccurences - a.nbOccurences)];
  // console.log("sorted ",sorted)
  return sorted.splice(0, n);
}

const getAllWordsMap = (elasticResponse /*, request*/) => {
  //console.log("elasticResponse ",elasticResponse)

  let hits = Array.from(elasticResponse);
  // console.log("hits ",hits)

  var wordsMap = [];
  var wordss2;
  let coHashtagArr1 = hits
    .filter(
      (tweet) => tweet.description !== undefined && tweet.description !== null,
    )
    .map((tweet) => {
      return tweet.description.toLowerCase();
    });
  // console.log("coHashtagArr1 ",coHashtagArr1)
  var wordss = [];
  for (var i = 0; i < coHashtagArr1.length; i++) {
    var intermediate = coHashtagArr1[i].split(" ");
    for (var j = 0; j < intermediate.length; j++) {
      intermediate[j] = intermediate[j].replace(/[^A-Za-z0-9/:.]/g, "");
      if (intermediate[j].length > 0 && intermediate[j] !== " ") {
        wordss.push(intermediate[j]);
      }
    }
  }
  var stopword1 = stopword.removeStopwords(wordss);
  stopword1 = stopword1.join(" ");

  let coHashtagArr2 = hits
    .filter(
      (tweet) => tweet.image_text !== undefined && tweet.image_text !== null,
    )
    .map((tweet) => {
      return tweet.image_text.toLowerCase();
    });

  var wordss1 = [];
  for (var i = 0; i < coHashtagArr2.length; i++) {
    var intermediate1 = coHashtagArr2[i].split(" ");
    for (var j = 0; j < intermediate1.length; j++) {
      intermediate1[j] = intermediate1[j].replace(/[^A-Za-z0-9/:.]/g, "");
      if (intermediate1[j].length > 0 && intermediate1[j] !== " ") {
        wordss1.push(intermediate1[j]);
      }
    }
  }

  var stopword2 = stopword.removeStopwords(wordss1);
  stopword2 = stopword2.join(" ");

  if (hits[0].facebook_id) {
    //console.log("DAAAAA ")

    let coHashtagArr3 = hits
      .filter((tweet) => tweet.message !== undefined && tweet.message !== null)
      .map((tweet) => {
        return tweet.message.toLowerCase();
      });

    // console.log("coHashtagArr3 ",coHashtagArr3)
    var wordss3 = [];
    for (var i = 0; i < coHashtagArr3.length; i++) {
      var intermediate2 = coHashtagArr3[i].split(" ");
      for (var j = 0; j < intermediate2.length; j++) {
        intermediate2[j] = intermediate2[j].replace(/[^A-Za-z0-9/:.]/g, "");
        if (intermediate2[j].length > 0 && intermediate2[j] !== " ") {
          wordss3.push(intermediate2[j]);
        }
      }
    }
    var stopword3 = stopword.removeStopwords(wordss3);
    stopword3 = stopword3.join(" ");

    wordss2 = stopword1 + stopword2 + stopword3;
  } else {
    wordss2 = stopword1 + stopword2;
  }

  //var wordss2=stopword1+stopword2
  var final_count = unique.counts(wordss2);
  // console.log("final_count ",final_count)
  var pairs = Object.entries(final_count);
  //console.log("PAIRS ",pairs)
  //console.log("PAIRS ",pairs.length)

  for (var i = 0; i < pairs.length; i++) {
    pairs[i].word = pairs[i]["0"];
    pairs[i].nbOccurences = pairs[i]["1"];
    delete pairs[i][0];
    delete pairs[i][1];
  }
  wordsMap = pairs;
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

const createWordCloud = (plotlyJson /*, request*/) => {
  let mostUsedWords = getAllWordsMap(plotlyJson /*, request*/);
  //console.log("mostUsedWords ", mostUsedWords)
  mostUsedWords = mostUsedWords.map((word) => {
    //let w = word.includes("@") ? word : word.replace(/_/g, " ");
    return {
      text: word.word,
      value: word.nbOccurences,
      entity: word.entity,
      color: getColor(word.entity),
    };
  });
  //console.log("mostUsedWords ", mostUsedWords)

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
