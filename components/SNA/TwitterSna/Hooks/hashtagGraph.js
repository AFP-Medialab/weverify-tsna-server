import _ from "lodash";
import {lowercaseFieldInTweets} from "../../../SNA/lib/displayTweets"

addEventListener('message', event => {
  //console.log("hashtag worker on message")
  postMessage(createCoHashtagGraph(event.data));
})

function getUniqValuesOfField(tweets, field) {
    let nodeIds = tweets.filter(tweet => tweet._source[field] !== undefined)
                        .map((tweet) => { return tweet._source[field] })
                        .flat();
    let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
    return uniqNodeIds;
}
  
function getNodesAsHashtag(tweets) {
    let nodes = getUniqValuesOfField(tweets, "hashtags").map((val) => { return { id: val, label: val } });
    return nodes;
}

function getSizeOfField(tweets, field) {
    let valueArr = tweets.filter(tweet => tweet._source[field] !== undefined)
                        .map((tweet) => { return tweet._source[field] })
                        .flat();
    let sizeObj = _.countBy(valueArr);
    return sizeObj;
}

function getEdgesCoHashtag(tweets) {
    let coHashtagArr = tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 1)
                              .map((tweet) => { return tweet._source.hashtags });
    let edges = [];
    coHashtagArr.forEach(arr => {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          let sortedVertices = [arr[i], arr[j]].sort();
          edges.push({ id: sortedVertices.join("___and___"),
                      source: sortedVertices[0], 
                      target: sortedVertices[1],
                      label: sortedVertices.join("___and___"),
                      weight: 1,
                      size: 1,
                      type: "curve" });
        }
      }
    });
    let uniqEdges = groupByThenSum(edges, 'id', [], ['size', 'weight'], ['source', 'target', 'label', 'type']);
    return uniqEdges;
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


export function createCoHashtagGraph(tweets) {
    let lcTweets = lowercaseFieldInTweets(tweets);
    let nodes = getNodesAsHashtag(lcTweets);
    let sizeObj = getSizeOfField(lcTweets, "hashtags");
    nodes.map((node) => { 
      node.size= sizeObj[node.id];
      node.label = "#" + node.label + ": " + sizeObj[node.id].toString();
      return node;
    });

    let edges = getEdgesCoHashtag(lcTweets);
    let graph = {
      nodes: nodes,
      edges: edges
    }
    let topNodeGraph = getTopNodeGraph(graph, ["size"], [15], []);
    return {
      data: topNodeGraph
    };
  }