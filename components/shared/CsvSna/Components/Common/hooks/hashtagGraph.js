import _ from "lodash";
import {lowercaseFieldInTweets} from "../../lib/displayPosts";

function getUniqValuesOfField(data, field) {
  console.log("TWEETS ", data)
  console.log("FIELD ", field)

    let nodeIds1 = data.filter(tweet => tweet[field] !== undefined && tweet[field] !==0 && tweet[field] !==null)
                        .map((tweet) => { return tweet[field] })
                        .flat();
    console.log("nodeIds1 ", nodeIds1)
    var nodeIds=[]
    var intermediate=[]

    for(var i=0 ;i<nodeIds1.length; i++) {
      intermediate=nodeIds1[i].match(/#\S+/g)
      if(intermediate===null){
        continue
      }
      else{
        for(var j=0 ;j<intermediate.length; j++) {
          nodeIds.push(intermediate[j])
        }
        intermediate=null;
      }
    }

    console.log("nodeIds", nodeIds);
            
    let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
    console.log("uniqNodeIds ", uniqNodeIds)

    return uniqNodeIds;
}
  
function getNodesAsHashtag(data) {
    let nodes = getUniqValuesOfField(data, "description").map((val) => { return { id: val, label: val } });
    console.log("nodes ", nodes)

    return nodes;
}

function getSizeOfField(data, field) {
  console.log("DATA", data)
    let valueArr = data.filter(tweet => tweet[field] !== undefined && tweet[field] !==0 && tweet[field] !==null)
                        .map((tweet) => { return tweet[field] })
                        .flat();
     console.log("valueArr ", valueArr)
     console.log("length ",valueArr.length)
     
    

     var nodeIds=[]
    var intermediate=[]
    
    
    for(var i=0 ;i<valueArr.length; i++) {
      intermediate=valueArr[i].match(/#\S+/g)
      if(intermediate===null){
        continue
      }
      else {
        for(var j=0 ;j<intermediate.length; j++) {
          nodeIds.push(intermediate[j])
        }
        intermediate=null;
      }
      
    }
  
  
    
    console.log("nodeIdssss", nodeIds);                    

    let sizeObj = _.countBy(nodeIds);
    console.log("sizeObjSSSSSS ",sizeObj)
    return sizeObj;
}

function getEdgesCoHashtag(data) {
  console.log ("coHashtagArr-DATA",data )                          

    let coHashtagArr = data.filter(tweet => tweet.description !== undefined && tweet.description.length > 1 && tweet.description !==null)
                              .map((tweet) => { return tweet.description });




    console.log ("coHashtagArr",coHashtagArr )                          
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
    if (types.length !== 0 && types.length !== null) {
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
        if (attrToSkip.length > 0 && attrToSkip.length !== null)  { attrToSkip.forEach(attr => { obj[attr] = value[attr]; }); }
        if (attrToSumStr.length > 0 && attrToSumStr.length !== null) { attrToSumStr.forEach(attr => { obj[attr] = ''; }); }
        if (attrToSumNum.length > 0 && attrToSumNum.length !== null) { attrToSumNum.forEach(attr => { obj[attr] = 0; }); }
        res[value[key]] = obj;
        results.push(res[value[key]])
      }
      if (attrToSumNum.length > 0 && attrToSumNum.length !==0) {
        attrToSumNum.forEach(attr => {
          res[value[key]][attr] += value[attr];
        });
      }
      if (attrToSumStr.length > 0 && attrToSumStr.length !==0) {
        attrToSumStr.forEach(attr => {
          res[value[key]][attr] += value[attr];
        });
      }
      return res;
    }, {});
    return results;
}


export function createCoHashtagGraph(data) {
    let lcTweets = lowercaseFieldInTweets(data);
    console.log("lcTweets ",lcTweets)
    let nodes = getNodesAsHashtag(lcTweets);
    console.log("nodessssss ",nodes)
    let sizeObj = getSizeOfField(lcTweets, "description");
    console.log("sizeObj ", sizeObj)
    nodes.map((node) => { 
      node.size= sizeObj[node.id];
      console.log("node.size ", node.size)
      node.label = /* "#" +*/ node.label + ": " + sizeObj[node.id].toString();
      console.log("node.label ", node.label)
      return node;
    });
    console.log("LAST")
    let edges = getEdgesCoHashtag(lcTweets);
    console.log("edges ",edges)
    let graph = {
      nodes: nodes,
      edges: edges
    }
    let topNodeGraph = getTopNodeGraph(graph, ["size"], [15], []);
    return {
      data: topNodeGraph
    };
  }