import _ from "lodash";
import { lowercaseFieldInTweets, getDomain } from "../../lib/displayTweets";

addEventListener("message", (event) => {
  postMessage(createSocioSemantic4ModeGraph(event.data[0], event.data[1]));
});

function getTweetAttrObjArr(tweets, topUser) {
  let topUsers = [];
  for (let user in topUser) {
    if (user < 20) {
      //change here to choose the number of Top Retweeted User in the graphe
      topUsers.push(topUser[user].key.toLowerCase());
    }
  }

  let tweetAttrObjArr = tweets.map((tweet) => {
    let hashtags =
      tweet._source.hashtags !== undefined && tweet._source.hashtags !== null
        ? tweet._source.hashtags.map((hashtag) => {
            return "#" + hashtag;
          })
        : [];
    let userIsMentioned =
      tweet._source.user_mentions !== undefined &&
      tweet._source.user_mentions !== null
        ? tweet._source.user_mentions.map((obj) => {
            return "isMTed:@" + obj.screen_name;
          })
        : [];
    let userRTWC =
      tweet._source.quoted_status_id_str !== undefined &&
      tweet._source.quoted_status_id_str !== null
        ? ["RT:@" + tweet._source.screen_name]
        : [];
    let userReply =
      tweet._source.in_reply_to_screen_name !== undefined &&
      tweet._source.in_reply_to_screen_name !== null
        ? ["Rpl:@" + tweet._source.screen_name]
        : [];

    let userTopTweet =
      tweet._source.screen_name !== undefined &&
      tweet._source.screen_name !== null &&
      topUsers.includes(tweet._source.screen_name)
        ? ["TopRT:" + tweet._source.screen_name]
        : [];
    let retweetCount =
      tweet._source.retweet_count !== undefined &&
      tweet._source.retweet_count !== null &&
      topUsers.includes(tweet._source.screen_name)
        ? ["RTcount:" + tweet._source.retweet_count]
        : [];

    let urls =
      tweet._source.urls !== undefined && tweet._source.urls.length !== 0
        ? tweet._source.urls.map((url) => {
            return "URL:" + getDomain(url);
          })
        : [];

    let obj = {
      hashtags: [...new Set(hashtags)],
      userIsMentioned: [...new Set(userIsMentioned)],
      userRTWC: userRTWC,
      userReply: userReply,
      userTopTweet: userTopTweet,
      retweetCount: retweetCount,
      urls: [...new Set(urls)],
    };
    return obj;
  });
  return tweetAttrObjArr;
}

function getCoOccurence(tweetAttrObjArr) {
  let coOccur = [];
  tweetAttrObjArr.forEach((obj) => {
    if (obj.hashtags.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.hashtags));
    }
    if (obj.userIsMentioned.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.userIsMentioned));
    }
    if (obj.urls.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.urls));
    }

    if (obj.hashtags.length > 0 && obj.userIsMentioned.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userIsMentioned));
    }
    if (obj.hashtags.length > 0 && obj.userRTWC.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userRTWC));
    }
    if (obj.hashtags.length > 0 && obj.userTopTweet.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userTopTweet));
    }
    if (obj.hashtags.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userReply));
    }
    if (obj.hashtags.length > 0 && obj.urls.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.urls));
    }

    if (obj.userIsMentioned.length > 0 && obj.userRTWC.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.userRTWC));
    }
    if (obj.userIsMentioned.length > 0 && obj.userTopTweet.length > 0) {
      coOccur.push(
        getCombinationFrom2Arrs(obj.userIsMentioned, obj.userTopTweet),
      );
    }
    if (obj.userIsMentioned.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.userReply));
    }
    if (obj.userIsMentioned.length > 0 && obj.urls.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.urls));
    }

    if (obj.userRTWC.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userRTWC, obj.userReply));
    }
    if (obj.userRTWC.length > 0 && obj.urls.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userRTWC, obj.urls));
    }

    if (obj.userTopTweet.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userTopTweet, obj.userReply));
    }
    if (obj.userTopTweet.length > 0 && obj.urls.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userTopTweet, obj.urls));
    }

    if (obj.userReply.length > 0 && obj.urls.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userReply, obj.urls));
    }

    /*let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
      return coOccurGroupedBy;*/
  });
  let coOccurGroupedBy = groupByThenSum(
    coOccur.flat(),
    "id",
    [],
    ["count"],
    [],
  );
  return coOccurGroupedBy;
}

function getCoOccurCombinationFrom1Arr(arr) {
  let occurences = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      let sortedArr = [arr[i], arr[j]].sort();
      occurences.push({
        id: sortedArr[0] + "___and___" + sortedArr[1],
        count: 1,
      });
    }
  }
  return occurences;
}

function getCombinationFrom2Arrs(arr1, arr2) {
  let occurences = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      occurences.push({ id: arr1[i] + "___and___" + arr2[j], count: 1 });
    }
  }
  return occurences;
}

function groupByThenSum(
  arrOfObjects,
  key,
  attrToSumStr,
  attrToSumNum,
  attrToSkip,
) {
  let results = [];
  arrOfObjects.reduce((res, value) => {
    if (!res[value[key]]) {
      let obj = {};
      obj[key] = value[key];
      if (attrToSkip.length > 0) {
        attrToSkip.forEach((attr) => {
          obj[attr] = value[attr];
        });
      }
      if (attrToSumStr.length > 0) {
        attrToSumStr.forEach((attr) => {
          obj[attr] = "";
        });
      }
      if (attrToSumNum.length > 0) {
        attrToSumNum.forEach((attr) => {
          obj[attr] = 0;
        });
      }
      res[value[key]] = obj;
      results.push(res[value[key]]);
    }
    if (attrToSumNum.length > 0) {
      attrToSumNum.forEach((attr) => {
        res[value[key]][attr] += value[attr];
      });
    }
    if (attrToSumStr.length > 0) {
      attrToSumStr.forEach((attr) => {
        res[value[key]][attr] += value[attr];
      });
    }
    return res;
  }, {});
  return results;
}

function getEdgesFromCoOcurObjArr(coOccurObjArr) {
  let edges = [];
  coOccurObjArr.forEach((obj) => {
    let [first, second] = obj.id.split("___and___");

    let connectionType = null;
    if (first.startsWith("#") && second.startsWith("#")) {
      connectionType = "Hashtag-Hashtag";
    } else if (first.startsWith("isMTed:@") && second.startsWith("isMTed:@")) {
      connectionType = "Mention-Mention";
    } else if (first.startsWith("RT:@") && second.startsWith("RT:@")) {
      connectionType = "RetweetWC-RetweetWC";
    } else if (first.startsWith("Rpl:@") && second.startsWith("Rpl:@")) {
      connectionType = "Reply-Reply";
    } else if (first.startsWith("URL:") && second.startsWith("URL:")) {
      connectionType = "URL-URL";
    } else if (
      first.startsWith("RetweetedUser:") &&
      second.startsWith("RetweetedUser:")
    ) {
      connectionType = "TopRT-TopRT";
    } else {
      connectionType = "Else-Else";
    }

    edges.push({
      id: obj.id,
      label: obj.id,
      source: first,
      target: second,
      size: obj.count,
      weight: obj.count,
      color: getColor(connectionType),
      type: "curve",
    });
  });
  return edges;
}

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
  if (entity === "Reply" || entity === "Reply-Reply") return "#FFF000";
  if (entity === "Hashtag-Hashtag") return "#96cce0";
  if (entity === "URL-URL") return "#CC99C9";
  if (entity === "TopRT-TopRT") return "#000000";
  if (entity === "Else-Else") return "#C0C0C0";

  return "#35347B";
}

function getTopNodeGraph(
  graph,
  sortByProp = ["size"],
  topByType = [20, 20],
  types = ["Hashtag", "Mention"],
) {
  let sortNodes = _.sortBy(graph.nodes, sortByProp).reverse();
  let topNodes = [];
  if (types.length !== 0) {
    types.forEach((type, idx) => {
      let topNodesType = sortNodes
        .filter((node) => node.type === type)
        .slice(0, topByType[idx]);
      topNodes.push(topNodesType);
    });
    topNodes = topNodes.flat();
  } else {
    topNodes = sortNodes.slice(0, topByType[0]);
  }
  let topNodesId = topNodes.map((node) => {
    return node.id;
  });
  let filteredEdges = graph.edges.filter(
    (edge) => _.difference([edge.source, edge.target], topNodesId).length === 0,
  );
  return {
    nodes: topNodes,
    edges: filteredEdges,
  };
}

export const createSocioSemantic4ModeGraph = (tweets, topUser) => {
  //console.log("1 ", new Date().valueOf());
  let lcTweets = lowercaseFieldInTweets(tweets, "hashtags");
  lcTweets = lowercaseFieldInTweets(lcTweets, "user_mentions");
  lcTweets = lowercaseFieldInTweets(lcTweets, "screen_name");
  lcTweets = lowercaseFieldInTweets(lcTweets, "in_reply_to_screen_name");
  lcTweets = lowercaseFieldInTweets(lcTweets, "urls");
  //console.log("2 ",new Date().valueOf());
  let tweetAttrObjArr = getTweetAttrObjArr(lcTweets, topUser);
  //console.log("3 ",new Date().valueOf());
  let coOccurObjArr = getCoOccurence(tweetAttrObjArr);
  //console.log("4 ",new Date().valueOf());
  let edges = getEdgesFromCoOcurObjArr(coOccurObjArr);
  //console.log("5 ",new Date().valueOf());

  let nodes = [];
  let freqHashtagObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.hashtags;
      })
      .flat(),
  );
  let freqMentionObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.userIsMentioned;
      })
      .flat(),
  );
  let freqRTWCObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.userRTWC;
      })
      .flat(),
  );
  let freqReplyObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.userReply;
      })
      .flat(),
  );
  let freqURLObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.urls;
      })
      .flat(),
  );

  let freqTopRTUserObj = _.countBy(
    tweetAttrObjArr
      .map((obj) => {
        return obj.userTopTweet;
      })
      .flat(),
  );

  Object.entries(freqHashtagObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("Hashtag"),
      type: "Hashtag",
    }),
  );
  Object.entries(freqMentionObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("Mention"),
      type: "Mention",
    }),
  );
  Object.entries(freqRTWCObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("RetweetWC"),
      type: "RetweetWC",
    }),
  );
  Object.entries(freqReplyObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("Reply"),
      type: "Reply",
    }),
  );
  Object.entries(freqURLObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("URL"),
      type: "URL",
    }),
  );
  Object.entries(freqTopRTUserObj).forEach((arr) =>
    nodes.push({
      id: arr[0],
      label: arr[0] + ": " + arr[1],
      size: arr[1],
      color: getColor("TopRT"),
      type: "TopRT",
    }),
  );

  //console.log("6 ",new Date().valueOf());
  let topNodeGraph = getTopNodeGraph(
    { nodes: nodes, edges: edges },
    ["size"],
    [20, 20, 20, 20, 20, 20],
    ["Hashtag", "Mention", "RetweetWC", "Reply", "URL", "TopRT"],
  );
  //console.log("7 ",new Date().valueOf());
  return JSON.stringify({
    data: topNodeGraph,
  });
};
