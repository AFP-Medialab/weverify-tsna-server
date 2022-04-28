export function displayPostsInsta (filteredPost, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: 'ct_sna_result_date', field: 'date'},
            { title: 'ct_sna_result_username', field: 'screen_name'},
            { title: 'ct_sna_result_post', field: 'post'},
            { title: 'ct_sna_likes', field: "nbLikes", defaultSort: "desc" },
            { title: 'ct_sna_total_interactions', field: 'total_interactions'},
        ];
    } else if (sortedColumn === "total_interactions") {
        columns = [
            { title: 'ct_sna_result_date', field: 'date'},
            { title: 'ct_sna_result_username', field: 'screen_name'},
            { title: 'ct_sna_result_post', field: 'post'},
            { title: 'ct_sna_likes', field: "nbLikes"},
            { title: 'ct_sna_total_interactions', field: 'total_interactions', defaultSort: "desc" },
        ];
    } else {
        columns = [
            { title: 'ct_sna_result_date', field: 'date', defaultSort: "asc" },
            { title: 'ct_sna_result_username', field: 'screen_name'},
            { title: 'ct_sna_result_post', field: 'post'},
            { title: 'ct_sna_likes', field: "nbLikes"},
            { title: 'ct_sna_total_interactions', field: 'total_interactions'}, 
        ];
    }

    let csvArr = "ct_sna_result_date" + ',' 
                + "ct_sna_result_username" + ',' 
                + "ct_sna_result_post" + ',' 
                + 'ct_sna_likes' + ',' 
                + "ct_sna_total_interactions" + ',' 
               
    
    let resData = [];
    let index = 0;
    filteredPost.forEach(postObj => {
        resData.push(
            {
                id : index ++,
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

export function displayPostsFb (filteredPost, sortedColumn) {
  let columns = [];
  if (sortedColumn === "nbLikes") {
      columns = [
          { title: 'ct_sna_result_date', field: 'date'},
          { title: 'ct_sna_result_username', field: 'screen_name'},
          { title: 'ct_sna_result_post', field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: 'ct_sna_likes', field: "nbLikes", defaultSort: "desc" },
          { title: 'ct_sna_shares', field: 'shares'},
          { title: 'ct_sna_total_interactions', field: 'total_interactions'},
      ];
  } else if (sortedColumn === "total_interactions") {
      columns = [
          { title: 'ct_sna_result_date', field: 'date'},
          { title: 'ct_sna_result_username', field: 'screen_name'},
          { title: 'ct_sna_result_post', field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: 'ct_sna_likes', field: "nbLikes"},
          { title: 'ct_sna_shares', field: 'shares'},
          { title: 'ct_sna_total_interactions', field: 'total_interactions', defaultSort: "desc" },
      ];
  } else {
      columns = [
          { title: 'ct_sna_result_date', field: 'date', defaultSort: "asc" },
          { title: 'ct_sna_result_username', field: 'screen_name'},
          { title: 'ct_sna_result_post', field: 'post'/*, render: getPostWithClickableLink*/ },
          { title: 'ct_sna_likes', field: "nbLikes"},
          { title: 'ct_sna_shares', field: 'shares'},
          { title: 'ct_sna_total_interactions', field: 'total_interactions'},
          
      ];
  }

  let csvArr = "ct_sna_result_date" + ',' 
              + "ct_sna_result_username" + ',' 
              + "ct_sna_result_post" + ',' 
              + 'ct_sna_likes' + ',' 
              + "ct_sna_total_interactions" + ',' 
              + "ct_sna_shares" +'\n';
  
  let resData = [];
  let index = 0;
  filteredPost.forEach(postObj => {
      resData.push(
          {
              id : index ++,
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

