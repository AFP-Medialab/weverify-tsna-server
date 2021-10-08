

export function displayPostsInsta (filteredPost, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: keyword('ct_sna_result_date'), field: 'date'},
            { title: keyword('ct_sna_result_username'), field: 'screen_name'},
            { title: keyword('ct_sna_result_post'), field: 'post'},
            { title: keyword('ct_sna_likes'), field: "nbLikes", defaultSort: "desc" },
            { title: keyword('ct_sna_total_interactions'), field: 'total_interactions'},
        ];
    } else if (sortedColumn === "total_interactions") {
        columns = [
            { title: keyword('ct_sna_result_date'), field: 'date'},
            { title: keyword('ct_sna_result_username'), field: 'screen_name'},
            { title: keyword('ct_sna_result_post'), field: 'post'},
            { title: keyword('ct_sna_likes'), field: "nbLikes"},
            { title: keyword('ct_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
        ];
    } else {
        columns = [
            { title: keyword('ct_sna_result_date'), field: 'date', defaultSort: "asc" },
            { title: keyword('ct_sna_result_username'), field: 'screen_name'},
            { title: keyword('ct_sna_result_post'), field: 'post'},
            { title: keyword('ct_sna_likes'), field: "nbLikes"},
            { title: keyword('ct_sna_total_interactions'), field: 'total_interactions'},
            
            
            
        ];
    }

    let csvArr = keyword("ct_sna_result_date") + ',' 
                + keyword("ct_sna_result_username") + ',' 
                + keyword("ct_sna_result_post") + ',' 
                + keyword('ct_sna_likes') + ',' 
                + keyword("ct_sna_total_interactions") + ',' 
               
    
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
          { title: keyword('ct_sna_result_date'), field: 'date'},
          { title: keyword('ct_sna_result_username'), field: 'screen_name'},
          { title: keyword('ct_sna_result_post'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('ct_sna_likes'), field: "nbLikes", defaultSort: "desc" },
          { title: keyword('ct_sna_shares'), field: 'shares'},
          { title: keyword('ct_sna_total_interactions'), field: 'total_interactions'},
      ];
  } else if (sortedColumn === "total_interactions") {
      columns = [
          { title: keyword('ct_sna_result_date'), field: 'date'},
          { title: keyword('ct_sna_result_username'), field: 'screen_name'},
          { title: keyword('ct_sna_result_post'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('ct_sna_likes'), field: "nbLikes"},
          { title: keyword('ct_sna_shares'), field: 'shares'},
          { title: keyword('ct_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
      ];
  } else {
      columns = [
          { title: keyword('ct_sna_result_date'), field: 'date', defaultSort: "asc" },
          { title: keyword('ct_sna_result_username'), field: 'screen_name'},
          { title: keyword('ct_sna_result_post'), field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: keyword('ct_sna_likes'), field: "nbLikes"},
          { title: keyword('ct_sna_shares'), field: 'shares'},
          { title: keyword('ct_sna_total_interactions'), field: 'total_interactions'},
          
      ];
  }

  let csvArr = keyword("ct_sna_result_date") + ',' 
              + keyword("ct_sna_result_username") + ',' 
              + keyword("ct_sna_result_post") + ',' 
              + keyword('ct_sna_likes') + ',' 
              + keyword("ct_sna_total_interactions") + ',' 
              + keyword("ct_sna_shares") +'\n';
  
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

