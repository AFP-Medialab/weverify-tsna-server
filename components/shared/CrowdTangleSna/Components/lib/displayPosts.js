

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
                date: postObj.post_created,
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
              date: postObj.post_created,
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

