

export function displayPostsInsta (filteredPost, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
        ];
    } else if (sortedColumn === "total_interactions") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
        ];
    } else {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
            
            
            
        ];
    }

    let csvArr = keyword("twittersna_result_date") + ',' 
                + keyword("twittersna_result_username") + ',' 
                + keyword("twittersna_result_tweet") + ',' 
                + keyword('twittersna_result_like_nb') + ',' 
                + keyword("csv_sna_total_interactions") + ',' 
               
    
    let resData = [];
    filteredPost.forEach(postObj => {
        resData.push(
            {
                date: postObj.created,
                screen_name: <a href={"https://instagram.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
                post: postObj.description,
                nbLikes: postObj.likes,
                total_interactions: postObj.total_interactions,
                link: <a href={postObj.link} target="_blank" rel="noopener noreferrer" >{postObj.link} </a>
            }
        );
        
    });
    

    return {
        data: resData,
        columns: columns,
        csvArr: csvArr,
    };
};
export function displayPostsFb (filteredPost, keyword, sortedColumn) {
  let columns = [];
  if (sortedColumn === "nbLikes") {
      columns = [
          { title: keyword('twittersna_result_date'), field: 'date'},
          { title: keyword('twittersna_result_username'), field: 'screen_name'},
          { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
          { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
          { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
      ];
  } else if (sortedColumn === "total_interactions") {
      columns = [
          { title: keyword('twittersna_result_date'), field: 'date'},
          { title: keyword('twittersna_result_username'), field: 'screen_name'},
          { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
          { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
          { title: keyword('csv_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
      ];
  } else {
      columns = [
          { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
          { title: keyword('twittersna_result_username'), field: 'screen_name'},
          { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
          { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
          { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
          
      ];
  }

  let csvArr = keyword("twittersna_result_date") + ',' 
              + keyword("twittersna_result_username") + ',' 
              + keyword("twittersna_result_tweet") + ',' 
              + keyword('twittersna_result_like_nb') + ',' 
              + keyword("csv_sna_total_interactions") + ',' 
              + keyword("twittersna_result_retweet_nb") +'\n';
  
  let resData = [];
  filteredPost.forEach(postObj => {
      resData.push(
          {
              date: postObj.created,
              screen_name: <a href={"https://facebook.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
              post: postObj.description,
              nbLikes: postObj.likes,
              total_interactions: postObj.total_interactions,
              shares: postObj.shares,
              link:<a href={postObj.link} target="_blank" rel="noopener noreferrer">{postObj.link}</a>
          }
      );
      
  });
  

  return {
      data: resData,
      columns: columns,
      csvArr: csvArr,
  };
};

export function removeUnusedFields(posts, fields){
    let newPosts = posts.map((post) => {
      let postObj = JSON.parse(JSON.stringify(post));
        delete postObj._index;
        delete postObj._type;
        delete postObj._id;
        delete postObj._score;
        fields.map((field) =>{
          if (postObj._source[field] !== undefined && postObj._source[field] !== null) {
            delete postObj._source[field];        
          }
        });
        return postObj;
    });
    return newPosts;
  }

  export function lowercaseFieldInTweets(posts, field = 'description') {
    console.log("POSTS ",posts)
    let newPosts = posts.map((post) => {
      let postObj = JSON.parse(JSON.stringify(post));
      //console.log("PostOBj ",postObj[field])
      if (postObj[field] !== undefined && postObj[field] !== null) {
        if (Array.isArray(postObj[field])) {
          let newArr = postObj[field].map((element) => {
            if(field === "user_mentions") {
              element.screen_name = element.screen_name.toLowerCase();
              element.name = element.name.toLowerCase();
              return element;
            } else {
              return element.toLowerCase();
            }
          });
          postObj[field] = [...new Set(newArr)];
        } else {
          postObj[field] = postObj[field].toLowerCase();
        }
      }
      return postObj;
    });
    return newPosts;
}