import _ from "lodash";

addEventListener('message', event =>{
  postMessage(createSocioSemantic4ModeGraph(event.data))
})

function getTweetAttrObjArr(tweets /*,topUser*/) {
  
    var tweetAttrObjArr=null

    if(tweets[0].facebook_id){
      //console.log("FACEBOOK") /////////////////////////////////////// FB
      tweetAttrObjArr = tweets.map((tweet) => {
        //console.log("data ", tweet)
        /////////////////////////// HASHTAG

       
        var hashtags=[]
        if(tweet.description !=null || tweet.description !=undefined || tweet.image_text !=null || tweet.image_text !=undefined || tweet.message !=null || tweet.message !=undefined ) {
          var hashtags1=null
          var hashtags2=null
          var hashtags3=null
          var intermediate1=null
          var intermediate2=null
          var intermediate3=null

          if(tweet.description !=null && tweet.description !=undefined ){
            hashtags1=[]
            intermediate1 = tweet.description.match(/#\S+/g)
            if (intermediate1 !=null && intermediate1 !=undefined){
              for(var i=0; i<intermediate1.length ;i++){
                if(intermediate1[i][1]!='.'){
                  hashtags1.push(intermediate1[i].toLowerCase())
                }
              }
            }
            else{
              hashtags1=null
            }
          
          }
          if(tweet.image_text !=null && tweet.image_text !=undefined ){
            hashtags2=[]
            intermediate2 = tweet.image_text.match(/#\S+/g)
            if (intermediate2 !=null && intermediate2 !=undefined){
              for(var i=0; i<intermediate2.length ;i++){
                if(intermediate2[i][1]!='.'){
                  hashtags2.push(intermediate2[i].toLowerCase())
                }
              }
              
            }
            else{
              hashtags2=null
            }
          }
          if(tweet.message !=null && tweet.message !=undefined ){
            hashtags3=[]
            intermediate3 = tweet.message.match(/#\S+/g)
            if (intermediate3 !=null && intermediate3 !=undefined){
              for(var i=0; i<intermediate3.length ;i++){
                if(intermediate3[i][1]!='.'){
                  hashtags3.push(intermediate3[i].toLowerCase())
                }
              }
            }
            else{
              hashtags3=null
            }
          }
          // console.log("hashtags1 ", hashtags1)
          // console.log("hashtags2 ", hashtags2)
         //  console.log("hashtags3 ", hashtags3)

          if (hashtags1 !=null && hashtags2 !=null && hashtags3 !=null){
            hashtags=hashtags1.concat(hashtags2).concat(hashtags3)
          }
          else{
            if (hashtags1 ===null ){
              if (hashtags2 !=null && hashtags3 !=null){
                hashtags=hashtags2.concat(hashtags3)
              }
              if(hashtags2===null){
                hashtags=hashtags3
              }
              if(hashtags3===null){
                hashtags=hashtags2
              }
            }
          ////////////////////////////////////
          if (hashtags2 ===null ){
            if (hashtags1 !=null && hashtags3 !=null){
              hashtags=hashtags1.concat(hashtags3)
            }
            if(hashtags1===null){
              hashtags=hashtags3
            }
            if(hashtags3===null){
              hashtags=hashtags1
            }
          }
           ////////////////////////////////////
           if (hashtags3 ===null ){
            if (hashtags1 !=null && hashtags2 !=null){
              hashtags=hashtags1.concat(hashtags2)
            }
            if(hashtags1===null){
              hashtags=hashtags2
            }
            if(hashtags2===null){
              hashtags=hashtags1
            }
          }
          }
          if (hashtags !=null && hashtags !=undefined){
            for (var i=0; i<hashtags.length; i++){
              hashtags[i] = hashtags[i].replace(/[^#._!?A-Za-z0-9]/g, '');
             // console.log("HASH.LENGTH",hashtags[i].length)
              for(var j=0 ; j<hashtags[i].length;j++){
                if( hashtags[i].endsWith('.')){
                  hashtags[i]=hashtags[i].slice(0, -1);
                  //console.log("TRUE",hashtags[i])
                }
              }
            }
          }
        }
       // console.log("HASHTAGS ", hashtags)
        
  
        ///////////////////////////////     MENTIONS
          var userIsMentioned=[]
          if(tweet.image_text !=null || tweet.image_text !=undefined || tweet.description !=null || tweet.description !=undefined || tweet.message !=null || tweet.message !=undefined) {
  
            var userIsMentioned1=null
            var userIsMentioned2=null
            var userIsMentioned3=null
            var intermediate1=null
            var intermediate2=null
            var intermediate3=null

            if(tweet.description !=null && tweet.description !=undefined ){
              userIsMentioned1=[]
              intermediate1 = tweet.description.match(/@\S+/g)
              if (intermediate1 !=null && intermediate1 !=undefined){
                for(var i=0; i<intermediate1.length ;i++){
                  if(intermediate1[i][1]!='.'){
                    userIsMentioned1.push(intermediate1[i].toLowerCase())
                  }
                }
                if(userIsMentioned1.length===0){
                  userIsMentioned1=null
                }
              }
              else{
                userIsMentioned1=null
              }
            }
            if(tweet.image_text !=null && tweet.image_text !=undefined ){
              userIsMentioned2=[]
              intermediate2 = tweet.image_text.match(/@\S+/g)
              if (intermediate2 !=null && intermediate2 !=undefined){
                for(var i=0; i<intermediate2.length ;i++){
                  if(intermediate2[i][1]!='.'){
                    userIsMentioned2.push(intermediate2[i].toLowerCase())  
                  }
                  
                }
                if(userIsMentioned2.length===0){
                  userIsMentioned2=null
                }
              }
              else{
                userIsMentioned2=null
              }
            }
            if(tweet.message !=null && tweet.message !=undefined ){
              userIsMentioned3=[]
              intermediate3 = tweet.message.match(/@\S+/g)
              if (intermediate3 !=null && intermediate3 !=undefined){
                for(var i=0; i<intermediate3.length ;i++){
                  if(intermediate3[i][1]!='.'){
                    userIsMentioned3.push(intermediate3[i].toLowerCase())  
                  }
                  
                }
                if(userIsMentioned3.length===0){
                  userIsMentioned3=null
                }
              }
              else{
                userIsMentioned3=null
              }
            }

            if (userIsMentioned1 !=null && userIsMentioned2 !=null && userIsMentioned3 !=null){
              userIsMentioned=userIsMentioned1.concat(userIsMentioned2).concat(userIsMentioned3)
            }
            else{
              if (userIsMentioned1 ===null ){
                if (userIsMentioned2 !=null && userIsMentioned3 !=null){
                  userIsMentioned=userIsMentioned2.concat(userIsMentioned3)
                }
                if(userIsMentioned2===null){
                  userIsMentioned=userIsMentioned3
                }
                if(userIsMentioned3===null){
                  userIsMentioned=userIsMentioned2
                }
              }
              //////////////////////////////
              if (userIsMentioned2 ===null ){
                if (userIsMentioned1 !=null && userIsMentioned3 !=null){
                  userIsMentioned=userIsMentioned1.concat(userIsMentioned3)
                }
                if(userIsMentioned1===null){
                  userIsMentioned=userIsMentioned3
                }
                if(userIsMentioned3===null){
                  userIsMentioned=userIsMentioned1
                }
              }
              ////////////////////////////////
              if (userIsMentioned3 ===null ){
                if (userIsMentioned1 !=null && userIsMentioned2 !=null){
                  userIsMentioned=userIsMentioned1.concat(userIsMentioned2)
                }
                if(userIsMentioned1===null){
                  userIsMentioned=userIsMentioned2
                }
                if(userIsMentioned2===null){
                  userIsMentioned=userIsMentioned1
                }
              }
            }
            //console.log("userIsMentioned1-LENGTH", userIsMentioned)   
  
            if(userIsMentioned != null || userIsMentioned != undefined){
              for (var i=0; i<userIsMentioned.length; i++){
                userIsMentioned[i] = userIsMentioned[i].replace(/[^@._A-Za-z0-9]/g, '');
                for(var j=0 ; j<userIsMentioned[i].length;j++){
                  if( userIsMentioned[i].endsWith('.')){
                    userIsMentioned[i]=userIsMentioned[i].slice(0, -1);
                   // console.log("TRUE",userIsMentioned[i])
                  }
                  if(userIsMentioned[i][1]==='.'){
                    userIsMentioned[i]=userIsMentioned[i].replace(userIsMentioned[i][1],"")
                  }
                }
              }
            }
          }
       
          //////////////////////////////////////////////// URL
          var urls=[]
          if(tweet.description !=null || tweet.description !=undefined || tweet.image_text !=null || tweet.image_text !=undefined || tweet.message !=null || tweet.message !=undefined ) {
            var urls1=null
            var urls2=null
            var urls3=null
            if(tweet.message !=null && tweet.message !=undefined ){
              urls1 = tweet.message.match(/http\S+/g)
            }
            if(tweet.description !=null && tweet.description !=undefined ){
              urls2 = tweet.description.match(/http\S+/g)
            }
            if(tweet.image_text !=null && tweet.image_text !=undefined ){
              urls3 = tweet.image_text.match(/http\S+/g)
            }

            if (urls1 !=null && urls2 !=null && urls3 !=null){
              urls=urls1.concat(urls2).concat(urls3)
            }
            else{
              if (urls1 ===null ){
                if (urls2 !=null && urls3 !=null){
                  urls=urls2.concat(urls3)
                }
                if(urls2===null){
                  urls=urls3
                }
                if(urls3===null){
                  urls=urls2
                }
              }
              //////////////////////////////
              if (urls2 ===null ){
                if (urls1 !=null && urls3 !=null){
                  urls=urls1.concat(urls3)
                }
                if(urls1===null){
                  urls=urls3
                }
                if(urls3===null){
                  urls=urls1
                }
              }
              ////////////////////////////////
              if (urls3 ===null ){
                if (urls1 !=null && urls2 !=null){
                  urls=urls1.concat(urls2)
                }
                if(urls1===null){
                  urls=urls2
                }
                if(urls2===null){
                  urls=urls1
                }
              }
            }
            if (urls !=null && urls !=undefined){
              for (var i=0; i<urls.length; i++){
                urls[i] = "URL:"+getDomain(urls[i])
              }
            }
           // console.log("urls ", urls)

            }
            ////////////////////////////////////// NUMBER OF SHARES  
            var shares=[]
            var post=[]
            if(tweet.shares !=null || tweet.shares !=undefined) {
              shares=tweet.shares
              post=tweet.url
              }
        let obj = {
          hashtags: [...new Set(hashtags)], 
          userIsMentioned: [...new Set(userIsMentioned)],
          shares: shares,
          urls: [...new Set(urls)],
          post:post
        }
        return obj;
      });
    }
    else{
     tweetAttrObjArr = tweets.map((tweet) => {

      var hashtags=[]
      if(tweet.description !=null || tweet.description !=undefined || tweet.image_text !=null || tweet.image_text !=undefined  ) {
        var hashtags1=null
        var hashtags2=null
        var intermediate1=null
        var intermediate2=null
        if(tweet.description !=null && tweet.description !=undefined ){
           hashtags1=[]
          intermediate1 = tweet.description.match(/#\S+/g)
          if (intermediate1 !=null && intermediate1 !=undefined){
            for(var i=0; i<intermediate1.length ;i++){
              if(intermediate1[i][1]!='.'){
                hashtags1.push(intermediate1[i].toLowerCase())
              }
            }
          }
          else{
            hashtags1=null
          }
        }
        
        if(tweet.image_text !=null && tweet.image_text !=undefined ){
          hashtags2=[]
          intermediate2 = tweet.image_text.match(/#\S+/g)
          if (intermediate2 !=null && intermediate2 !=undefined){
            for(var i=0; i<intermediate2.length ;i++){
              if(intermediate2[i][1]!='.'){
                hashtags2.push(intermediate2[i].toLowerCase())
              }
            }
            
          }
          else{
            hashtags2=null
          }
        }
        
        if (hashtags1 !=null && hashtags2 !=null){
          hashtags=hashtags1.concat(hashtags2)
        }
        else{
          if (hashtags1 ===null){
            hashtags=hashtags2
          }
          if (hashtags2 ===null){
            hashtags=hashtags1
          }
        }
       // console.log("HASH-LENGTH", hashtags)   

      // console.log("description.match ", hashtags)   
        if (hashtags !=null || hashtags !=undefined){
          for (var i=0; i<hashtags.length; i++){
            hashtags[i] = hashtags[i].replace(/[^#._!?A-Za-z0-9]/g, '');
            for(var j=0 ; j<hashtags[i].length;j++){
              if( hashtags[i].endsWith('.')){
                hashtags[i]=hashtags[i].slice(0, -1);
                //console.log("TRUE",hashtags[i])
              }
            } 
          }
        }
      }

        /////////////////////////////////////////////////////////// MENTIONS
        var userIsMentioned=[]
        if(tweet.image_text !=null || tweet.image_text !=undefined || tweet.description !=null || tweet.description !=undefined ) {

          var userIsMentioned1=null
          var userIsMentioned2=null
          var intermediate1=null
          var intermediate2=null
          if(tweet.description !=null && tweet.description !=undefined){
            userIsMentioned1=[]
            intermediate1 = tweet.description.match(/@\S+/g)
            if (intermediate1 !=null && intermediate1 !=undefined){
              for(var i=0; i<intermediate1.length ;i++){
                if(intermediate1[i][1]!='.'){
                  userIsMentioned1.push(intermediate1[i].toLowerCase())
                }
              }
              if(userIsMentioned1.length===0){
                userIsMentioned1=null
              }
            }
            else{
              userIsMentioned1=null
            }

            }
            
          if(tweet.image_text !=null && tweet.image_text !=undefined){
            userIsMentioned2=[]
            intermediate2 = tweet.image_text.match(/@\S+/g)
            if (intermediate2 !=null && intermediate2 !=undefined){
              for(var i=0; i<intermediate2.length ;i++){
                if(intermediate2[i][1]!='.'){
                  userIsMentioned2.push(intermediate2[i].toLowerCase())  
                }
                
              }
              if(userIsMentioned2.length===0){
                userIsMentioned2=null
              }
            }
            else{
              userIsMentioned2=null
            }
          }
      
          if (userIsMentioned1 !=null && userIsMentioned2 !=null ){
            userIsMentioned=userIsMentioned1.concat(userIsMentioned2)
          }
          else{
            if (userIsMentioned1 ===null){
              userIsMentioned=userIsMentioned2
            }
            if (userIsMentioned2 ===null){
              userIsMentioned=userIsMentioned1
            }
          }
         // console.log("userIsMentioned1-LENGTH", userIsMentioned)   

          if(userIsMentioned != null || userIsMentioned != undefined){
            for (var i=0; i<userIsMentioned.length; i++){
              userIsMentioned[i] = userIsMentioned[i].replace(/[^@._A-Za-z0-9]/g, '');
              for(var j=0 ; j<userIsMentioned[i].length;j++){
                if( userIsMentioned[i].endsWith('.')){
                  userIsMentioned[i]=userIsMentioned[i].slice(0, -1);
                }
                
              }
            }
          }
        }
        
        ///////////////////////////////////////////////////////// URL
        var urls=[]
        if(tweet.image_text !=null || tweet.image_text !=undefined || tweet.description !=null || tweet.description !=undefined ) {

          var urls1=null
          var urls2=null

          if(tweet.description !=null && tweet.description !=undefined ){
            urls1 = tweet.description.match(/http\S+/g)
          }
          if(tweet.image_text !=null && tweet.image_text !=undefined ){
            urls2 = tweet.image_text.match(/http\S+/g)
          }

          if (urls1 !=null && urls2 !=null){
            urls=urls1.concat(urls2)
          }
          else{
            if (urls1 ===null){
              urls=urls2
            }
            if (urls2 ===null){
              urls=urls1
            }
          }
          if (urls !=null && urls !=undefined){
            for (var i=0; i<urls.length; i++){
              urls[i] = "URL:"+getDomain(urls[i])
            }
          }
        }
        ////////////////////////////////////// NUMBER OF TOTAL INTERACTIONS  

        var total_interactions=[]
        var post=[]
        if(tweet.total_interactions !=null || tweet.total_interactions !=undefined) {
          total_interactions=tweet.total_interactions
          post=tweet.url
          }
      let obj = {
        hashtags: [...new Set(hashtags)], 
        userIsMentioned: [...new Set(userIsMentioned)],
        total_interactions: total_interactions,
        urls: [...new Set(urls)],
        post:post,
      }
      return obj;
    });
  }
    return tweetAttrObjArr;

  }
  


  export function getDomain(url) {
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
      if (obj.hashtags.length > 0 && obj.urls.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.urls));
      }
      
      if (obj.userIsMentioned.length > 0 && obj.urls.length > 0) {
        coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.urls));
      }
     
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
    //console.log("edges ",edges)
    coOccurObjArr.forEach((obj) => {
      let [first, second] =  obj.id.split("___and___");
      
      let connectionType = null;
      if (first.startsWith("#") && second.startsWith("#")) {
        connectionType = "Hashtag-Hashtag";
      } else if (first.startsWith("@") && second.startsWith("@")) {
        connectionType = "Mention-Mention";
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
    //if (entity === "USERS-USERS") return "#C0C0C0";

    if (entity === "RetweetWC" || entity === "RetweetWC-RetweetWC") return '#FF6F69';
    if (entity === "Reply" || entity === "Reply-Reply") return '#FFF000';
    if (entity === "Hashtag-Hashtag") return "#96cce0";
    if (entity === "URL-URL") return "#CC99C9";
    if (entity === "TopRT-TopRT") return "#000000";
    if (entity === "Else-Else") return "#C0C0C0";
  
    return '#35347B';
  }

  function getTopNodeGraph(graph, sortByProp=["size"], topByType=[20, 20, 20,20], types=["Hashtag", "Mention", "URL", "USERS"]) {
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


const createSocioSemantic4ModeGraph = (tweets/*, topUser*/) => {
      let lcTweets = tweets;
      let tweetAttrObjArr = getTweetAttrObjArr(lcTweets/*, topUser*/); 
      let coOccurObjArr = getCoOccurence(tweetAttrObjArr);
      let edges = getEdgesFromCoOcurObjArr(coOccurObjArr);
      let nodes = [];
      let freqHashtagObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.hashtags; }).flat());
      let freqMentionObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userIsMentioned; }).flat());
      let freqURLObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.urls; }).flat());
      Object.entries(freqHashtagObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Hashtag"), type: "Hashtag" }));
      Object.entries(freqMentionObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Mention"), type: "Mention" }));
      Object.entries(freqURLObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("URL"), type: "URL" }));
      let topNodeGraph = getTopNodeGraph({ nodes: nodes, edges: edges}, ["size"], [20 , 20, 20/*, 20, 20, 20*/], ['Hashtag', 'Mention', 'URL'/*, 'USERS' ,'RetweetWC', 'TopRT'*/]);
      return JSON.stringify({
        data: topNodeGraph
      });
}