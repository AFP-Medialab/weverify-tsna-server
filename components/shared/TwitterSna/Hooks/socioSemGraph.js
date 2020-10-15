
function lowercaseFieldInTweets(tweets, field = 'hashtags') {
    let newTweets = tweets.map((tweet) => {
      let tweetObj = JSON.parse(JSON.stringify(tweet));
      if (tweetObj._source[field] !== undefined && tweetObj._source[field] !== null) {
        if (Array.isArray(tweetObj._source[field])) {
          let newArr = tweetObj._source[field].map((element) => {
            if(field === "user_mentions") {
              element.screen_name = element.screen_name.toLowerCase();
              element.name = element.name.toLowerCase();
              return element;
            } else {
              return element.toLowerCase();
            }
          });
          tweetObj._source[field] = [...new Set(newArr)];
        } else {
          tweetObj._source[field] = tweetObj._source[field].toLowerCase();
        }
      }
      return tweetObj;
    });
    return newTweets;
}

function getTweetAttrObjArr(tweets) {
    let tweetAttrObjArr = tweets.map((tweet) => {
      let hashtags = (tweet._source.hashtags !== undefined && tweet._source.hashtags !== null)
        ? tweet._source.hashtags.map((hashtag) => { return "#" + hashtag; })
        : [];
      let userIsMentioned = (tweet._source.user_mentions !== undefined && tweet._source.user_mentions !== null)
        ? tweet._source.user_mentions.map((obj) => { return "isMTed:@" + obj.screen_name; })
        : [];
      let userRTWC = (tweet._source.quoted_status_id_str !== undefined && tweet._source.quoted_status_id_str !== null)
      ? ["RT:@" + tweet._source.screen_name]
      : [];
      let userReply = (tweet._source.in_reply_to_screen_name !== undefined && tweet._source.in_reply_to_screen_name !== null)
      ? ["Rpl:@" + tweet._source.screen_name]
      : [];
  
      let urls = (tweet._source.urls !== undefined && tweet._source.urls.length !== 0)
      ? tweet._source.urls.map((url) => { return "URL:" + getDomain(url); })
      : [];
  
      let obj = {
        hashtags: [...new Set(hashtags)],
        userIsMentioned: [...new Set(userIsMentioned)],
        userRTWC: userRTWC,
        userReply: userReply,
        urls: [...new Set(urls)]
      }
      return obj;
    });
    return tweetAttrObjArr;
  }

  function getDomain(url) {
    var domain;
  
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    }
    else {
      domain = url.split('/')[0];
    }
    
    if (domain.indexOf("www.") > -1) { 
      domain = domain.split('www.')[1];
    }
    
    domain = domain.split(':')[0];
    domain = domain.split('?')[0];
  
    return domain;
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
      if (obj.hashtags.length > 0 && obj.userReply.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userReply));
      }
      if (obj.hashtags.length > 0 && obj.urls.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.urls));
      }
  
      if (obj.userIsMentioned.length > 0 && obj.userRTWC.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.userRTWC));
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
  
      if (obj.userReply.length > 0 && obj.urls.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.userReply, obj.urls));
      }
  
      let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
      return coOccurGroupedBy;
    })
    let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
    return coOccurGroupedBy;
  }

  function getCoOccurCombinationFrom1Arr(arr) {
    let occurences = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        let sortedArr = [arr[i], arr[j]].sort()
        occurences.push({ id: sortedArr[0] + '___and___' + sortedArr[1], count: 1 });
      }
    }
    return occurences;
  }
  
  function getCombinationFrom2Arrs(arr1, arr2) {
    let occurences = [];
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        occurences.push({ id: arr1[i] + '___and___' + arr2[j], count: 1 });
      }
    }
    return occurences;
  }

  function groupByThenSum(arrOfObjects, key, attrToSumStr, attrToSumNum, attrToSkip) {
    let results = [];
    arrOfObjects.reduce((res, value) => {
      if (!res[value[key]]) {
        let obj = {};
        obj[key] = value[key];
        if (attrToSkip.length > 0) { attrToSkip.forEach(attr => { obj[attr] = value[attr]; }); }
        if (attrToSumStr.length > 0) { attrToSumStr.forEach(attr => { obj[attr] = ''; }); }
        if (attrToSumNum.length > 0) { attrToSumNum.forEach(attr => { obj[attr] = 0; }); }
        res[value[key]] = obj;
        results.push(res[value[key]])
      }
      if (attrToSumNum.length > 0) {
        attrToSumNum.forEach(attr => {
          res[value[key]][attr] += value[attr];
        });
      }
      if (attrToSumStr.length > 0) {
        attrToSumStr.forEach(attr => {
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
      let [first, second] =  obj.id.split("___and___");
  
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
      }
       else {
        connectionType = "Else-Else";
      }
  
      edges.push(
        {
          id: obj.id, 
          label: obj.id, 
          source: first,
          target: second,
          size: obj.count, 
          weight: obj.count,
          color: getColor(connectionType),
          type: "curve"
      });
    });
    return edges;
  }

  function getColor(entity) {
    if (entity === "Person") return '#8242BB';
    if (entity === "Organization") return '#BB424F';
    if (entity === "UserID") return '#42BB9E';
    if (entity === "Location") return '#BB7042';
  
    // Get color for graph's nodes, edges 
    if (entity === "Hashtag") return '#3388AA';
    if (entity === "URL") return "#9400D3";
    if (entity === "Mention" || entity === "Mention-Mention") return '#88D8B0';
    if (entity === "RetweetWC" || entity === "RetweetWC-RetweetWC") return '#FF6F69';
    if (entity === "Reply" || entity === "Reply-Reply") return '#FFEEAD';
    if (entity === "Hashtag-Hashtag") return "#96cce0";
    if (entity === "URL-URL") return "#CC99C9";
    if (entity === "Else-Else") return "#C0C0C0";
  
    return '#35347B';
  }

  function getTopNodeGraph(graph, sortByProp=["size"], topByType=[20, 20], types=["Hashtag", "Mention"]) {
    let sortNodes = _.sortBy(graph.nodes, sortByProp).reverse();
    let topNodes = []
    if (types.length !== 0) {
      types.forEach((type, idx) => {
        let topNodesType = sortNodes.filter(node => node.type === type).slice(0, topByType[idx]);
        topNodes.push(topNodesType);
      })
      topNodes = topNodes.flat();
    } else {
      topNodes = sortNodes.slice(0, topByType[0]);
    }
    let topNodesId = topNodes.map((node) => { return node.id; });
    let filteredEdges = graph.edges.filter(edge => _.difference([edge.source, edge.target], topNodesId).length === 0);
    return {
      nodes: topNodes,
      edges: filteredEdges
    }
  }


export const createSocioSemantic4ModeGraph = (tweets) => {
      let lcTweets = lowercaseFieldInTweets(tweets, 'hashtags');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'user_mentions');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'screen_name');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'in_reply_to_screen_name');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'urls');
      
      let tweetAttrObjArr = getTweetAttrObjArr(lcTweets);

      let coOccurObjArr = getCoOccurence(tweetAttrObjArr);
      let edges = getEdgesFromCoOcurObjArr(coOccurObjArr);
      
      let nodes = [];
      let freqHashtagObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.hashtags; }).flat());
      let freqMentionObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userIsMentioned; }).flat());
      let freqRTWCObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userRTWC; }).flat());
      let freqReplyObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userReply; }).flat());
      let freqURLObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.urls; }).flat());
      Object.entries(freqHashtagObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Hashtag"), type: "Hashtag" }));
      Object.entries(freqMentionObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Mention"), type: "Mention" }));
      Object.entries(freqRTWCObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("RetweetWC"), type: "RetweetWC" }));
      Object.entries(freqReplyObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Reply"), type: "Reply" }));
      Object.entries(freqURLObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("URL"), type: "URL" }));

      let topNodeGraph = getTopNodeGraph({ nodes: nodes, edges: edges}, ["size"], [20, 10, 10, 10, 15], ['Hashtag', 'Mention', 'RetweetWC', 'Reply', 'URL']);
      return {
        data: topNodeGraph
      };
}

function createGraphWhenClickANode(e) {

    let selectedNode = e.data.node;

    let neighborNodes = e.data.renderer.graph.adjacentNodes(selectedNode.id);
    let neighborEdges = e.data.renderer.graph.adjacentEdges(selectedNode.id);

    let neighborNodeIds = neighborNodes.map((node) => { return node.id; });
    neighborNodeIds.push(selectedNode.id);
    let neighborEdgeIds = neighborEdges.map((edge) => { return edge.id; });

    let clonedNodes = JSON.parse(JSON.stringify(e.data.renderer.graph.nodes()));
    let clonedEdges = JSON.parse(JSON.stringify(e.data.renderer.graph.edges()));

    let updatedNodes = clonedNodes.map((node) => {
        if (!neighborNodeIds.includes(node.id)) {
            node.color = "#C0C0C0";
        }
        return node;
    })

    let updatedEdges = clonedEdges.map((edge) => {
        if (neighborEdgeIds.includes(edge.id)) {
            edge.color = "#000000";
        } else {
            edge.color = "#C0C0C0";
        }
        return edge;
    })

    let newGraph = {
        nodes: updatedNodes,
        edges: updatedEdges
    }

    console.log("newGraph", newGraph);
    return newGraph;
}

const onClickNodeSocioSemantic4ModeGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }

        setSocioSemantic4ModeGraphClickNode(createGraphWhenClickANode(data));

        setSocioSemantic4ModeGraphReset(initGraph);

        if (data.data.node.type === "Hashtag") {
            let selectedHashtag = data.data.node.id.replace("#", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 0)
                .filter(function (tweet) {
                    let hashtagArr = tweet._source.hashtags.map((v) => { return v.toLowerCase(); });
                    return hashtagArr.includes(selectedHashtag.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Mention") {
            let selectedUser = data.data.node.id.replace("isMTed:@", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.user_mentions !== undefined && tweet._source.user_mentions.length > 0)
                .filter(function (tweet) {
                    let lcMentionArr = tweet._source.user_mentions.map(v => v.screen_name.toLowerCase());
                    return lcMentionArr.includes(selectedUser.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "RetweetWC") {
            let selectedUser = data.data.node.id.replace("RT:@", "");
            let filteredTweets = result.tweets.filter(tweet => 
                tweet._source.quoted_status_id_str !== undefined 
                && tweet._source.quoted_status_id_str !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Reply") {
            let selectedUser = data.data.node.id.replace("Rpl:@", "");
            let filteredTweets = result.tweets.filter(tweet => 
                tweet._source.in_reply_to_screen_name !== undefined 
                && tweet._source.in_reply_to_screen_name !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "URL") {
            let selectedURL = data.data.node.id.replace("URL:", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.urls !== undefined && tweet._source.urls.length > 0)
                .filter(function (tweet) {
                    let urlArr = tweet._source.urls.map((url) => {
                        return getDomain(url).toLowerCase();
                    });
                    return urlArr.includes(selectedURL.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        }
    }