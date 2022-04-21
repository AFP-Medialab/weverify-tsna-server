import _ from "lodash";

addEventListener('message', event =>{
  postMessage(createCoHashtagGraph(event.data))
})

function getUniqValuesOfField(data, field1, field2, field3) {
    let nodeIds1 = data.filter(tweet => tweet[field1] !== undefined && tweet[field1] !==0 && tweet[field1] !==null)
                        .map((tweet) => { return tweet[field1] })
                        .flat();

    let nodeIds2 = data.filter(tweet => tweet[field2] !== undefined && tweet[field2] !==0 && tweet[field2] !==null)
                        .map((tweet) => { return tweet[field2] })
                        .flat();
    var nodeIds3=[]
    if(data[0].facebook_id) {
    let nodeIds4 = data.filter(tweet => tweet[field3] !== undefined && tweet[field3] !==0 && tweet[field3] !==null)
                        .map((tweet) => { return tweet[field3] })
                        .flat();
    var nodeIds5=nodeIds1.concat(nodeIds2)                    
    nodeIds3=nodeIds5.concat(nodeIds4)
    }
    else{
      nodeIds3=nodeIds1.concat(nodeIds2)
    }
   
    var nodeIds=[]
    var intermediate=[]

    for(var i=0 ;i<nodeIds3.length; i++) {
      intermediate=nodeIds3[i].match(/#\S+/g)

      if(intermediate===null){
        continue
      }
      else{
        for (var j=0; j<intermediate.length; j++){
          intermediate[j] = intermediate[j].replace(/[^#._!?A-Za-z0-9]/g, '');
          for(var k=0 ; k<intermediate[j].length ;k++){
              if( intermediate[j].endsWith('.')){
                intermediate[j]=intermediate[j].slice(0, -1);
                //console.log("TRUE1",intermediate[j])
              }
            }
          
          nodeIds.push(intermediate[j].toLowerCase())
        }
        intermediate=null;
      }
    }

    let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
    return uniqNodeIds;
}
  
function getNodesAsHashtag(data) {
    let nodes = getUniqValuesOfField(data, "description", "image_text", "message").map((val) => { return { id: val, label: val } });
    return nodes;
}

function getSizeOfField(data, field1, field2, field3) {
    let valueArr1 = data.filter(tweet => tweet[field1] !== undefined && tweet[field1] !==0 && tweet[field1] !==null)
                        .map((tweet) => { return tweet[field1] })
                        .flat();
    let valueArr2 = data.filter(tweet => tweet[field2] !== undefined && tweet[field2] !==0 && tweet[field2] !==null)
                        .map((tweet) => { return tweet[field2] })
                        .flat(); 
    var valueArr=[]                
    if(data[0].facebook_id) {
    let valueArr3 = data.filter(tweet => tweet[field3] !== undefined && tweet[field3] !==0 && tweet[field3] !==null)
                        .map((tweet) => { return tweet[field3] })
                        .flat();
    var valueArr4 =valueArr1.concat(valueArr2)       
    valueArr =valueArr4.concat(valueArr3)
    }
    else{
      valueArr =valueArr1.concat(valueArr2)

    }                    
    var nodeIds=[]
    var intermediate=[]
    
    
    for(var i=0 ;i<valueArr.length; i++) {
      intermediate=valueArr[i].match(/#\S+/g)
      if(intermediate===null){
        continue
      }
      else {
       for (var j=0; j<intermediate.length; j++){
        intermediate[j] = intermediate[j].replace(/[^#._!?A-Za-z0-9]/g, '');
        for(var k=0 ; k<intermediate[j].length ;k++){
          if( intermediate[j].endsWith('.')){
            intermediate[j]=intermediate[j].slice(0, -1);
            //console.log("TRUE2",intermediate[j])
          }
        }
        nodeIds.push(intermediate[j].toLowerCase())
      }
        intermediate=null;
      }
      
    }
    let sizeObj = _.countBy(nodeIds);  
    return sizeObj;
}

function getEdgesCoHashtag(data) {
  var nodeIds=[]
  var intermediate=[]
  
  let coHashtagArr1 = data.filter(tweet => tweet.description !== undefined && tweet.description !==null)
                              .map((tweet) => { return tweet.description });
  let coHashtagArr2 = data.filter(tweet => tweet.image_text !== undefined && tweet.image_text !==null)
                            .map((tweet) => { return tweet.image_text });
  var coHashtagArr =[]                          
  if(data[0].facebook_id) {

  let coHashtagArr3 = data.filter(tweet => tweet.message !== undefined && tweet.message !==null)
                            .map((tweet) => { return tweet.message });

  var coHashtagArr4=coHashtagArr1.concat(coHashtagArr2)
  coHashtagArr= coHashtagArr4.concat(coHashtagArr3)
    }
    else{
      coHashtagArr= coHashtagArr1.concat(coHashtagArr2)
    }                            
    
  for(var i=0 ;i<coHashtagArr.length; i++) {
      intermediate=coHashtagArr[i].toLowerCase().match(/#\S+/g)

      if(intermediate===null || intermediate===undefined){
        continue
      }
      else {
       // intermediate = intermediate.replace(/[^#A-Za-z0-9]/g, '');
       for (var j=0; j<intermediate.length; j++){
        intermediate[j] = intermediate[j].replace(/[^#._!?A-Za-z0-9]/g, '');
        for(var k=0 ; k<intermediate[j].length ;k++){
          if( intermediate[j].endsWith('.')){
            intermediate[j]=intermediate[j].slice(0, -1);
            //console.log("TRUE",intermediate[j])
          }
        }
      }
        nodeIds.push(intermediate)
        
        intermediate=null;
      }
      }

    let edges = [];
    nodeIds.forEach(arr => {
      
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
  //  console.log("uniqEdges ",uniqEdges )
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
          res[value[key]][attr]  += value[attr];
        });
      }
      return res;
    }, {});
    return results;
}


function createCoHashtagGraph(data) {
    let lcTweets = data;
   // console.log("lcTweets-DATA",data)
   // console.log("lcTweets ",lcTweets)
    let nodes = getNodesAsHashtag(lcTweets);
    //console.log("nodessssss ",nodes)
    let sizeObj = getSizeOfField(lcTweets, "description", "image_text", "message");
   // console.log("sizeObj ", sizeObj)
    nodes.map((node) => { 
      node.size= sizeObj[node.id];
    //  console.log("node.size ", node.size)
      node.label = /* "#" +*/ node.label + ": " + sizeObj[node.id].toString();
   //   console.log("node.label ", node.label)
      return node;
    });
  //  console.log("LAST")
    let edges = getEdgesCoHashtag(lcTweets);
   // console.log("edges ",edges)
    let graph = {
      nodes: nodes,
      edges: edges
    }
    let topNodeGraph = getTopNodeGraph(graph, ["size"], [15], []);
    return {
      data: topNodeGraph
    };
  }