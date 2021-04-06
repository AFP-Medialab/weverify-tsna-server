
const getPostWithClickableLink = (cellData) => {
    let urls = cellData.post.match(/((http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?|pic\.facebook\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*))/g);
    if (urls === null)
        return cellData.post;

    let postText = cellData.post.split(urls[0]);
    if (urls[0].match(/pic\.facebook\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*)/))
        urls[0] = "https://" + urls[0];
    let element = <div>{postText[0]} <a href={urls[0]} target="_blank" rel="noopener noreferrer">{urls[0]}</a>{postText[1]}</div>;
    return element;
};


export function displayPostsInsta (filteredPost, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
            { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb'},
            { title: keyword('elastic_url'), field: 'link'}
        ];
    } else if (sortedColumn === "shareNb") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb', defaultSort: "desc" },
            { title: keyword('elastic_url'), field: 'link'}
        ];
    } else {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb'},
            {title: keyword('elastic_url'), field: 'link'}
            
            
            
        ];
    }

    let csvArr = keyword("twittersna_result_date") + ',' 
                + keyword("twittersna_result_username") + ',' 
                + keyword("twittersna_result_tweet") + ',' 
                + keyword('twittersna_result_like_nb') + ',' 
                + keyword("twittersna_result_retweet_nb") + ',' 
                + keyword("elastic_url") +'\n';
    
    let resData = [];
    filteredPost.forEach(postObj => {
        resData.push(
            {
                date: postObj.created,
                screen_name: <a href={"https://instagram.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
                post: postObj.description,
                nbLikes: postObj.likes,
                shareNb: postObj.total_interactions,
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
          { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb'},
          { title: keyword('elastic_url'), field: 'link'}
      ];
  } else if (sortedColumn === "shareNb") {
      columns = [
          { title: keyword('twittersna_result_date'), field: 'date'},
          { title: keyword('twittersna_result_username'), field: 'screen_name'},
          { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
          { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb', defaultSort: "desc" },
          { title: keyword('elastic_url'), field: 'link'}
      ];
  } else {
      columns = [
          { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
          { title: keyword('twittersna_result_username'), field: 'screen_name'},
          { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
          { title: keyword('twittersna_result_retweet_nb'), field: 'shareNb'},
          { title: keyword('elastic_url'), field: 'link'}
      ];
  }

  let csvArr = keyword("twittersna_result_date") + ',' 
              + keyword("twittersna_result_username") + ',' 
              + keyword("twittersna_result_tweet") + ',' 
              + keyword('twittersna_result_like_nb') + ',' 
              + keyword("twittersna_result_retweet_nb") + ',' 
              + keyword("elastic_url") +'\n';
  
  let resData = [];
  filteredPost.forEach(postObj => {
      resData.push(
          {
              date: postObj.created,
              screen_name: <a href={"https://facebook.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
              post: postObj.description,
              nbLikes: postObj.likes,
              shareNb: postObj.total_interactions,
              link: <a href={postObj.link} target="_blank" rel="noopener noreferrer">{postObj.link}</a>,
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

  export function lowercaseFieldInTweets(posts, field = 'hashtags') {
    let newPosts = posts.map((post) => {
      let postObj = JSON.parse(JSON.stringify(post));
      if (postObj._source[field] !== undefined && postObj._source[field] !== null) {
        if (Array.isArray(postObj._source[field])) {
          let newArr = postObj._source[field].map((element) => {
            if(field === "user_mentions") {
              element.screen_name = element.screen_name.toLowerCase();
              element.name = element.name.toLowerCase();
              return element;
            } else {
              return element.toLowerCase();
            }
          });
          postObj._source[field] = [...new Set(newArr)];
        } else {
          postObj._source[field] = postObj._source[field].toLowerCase();
        }
      }
      return postObj;
    });
    return newPosts;
}