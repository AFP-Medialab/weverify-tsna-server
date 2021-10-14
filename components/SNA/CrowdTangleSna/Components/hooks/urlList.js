    export const getJsonDataForURLTable = async (dataResponse, keyword) => {
        var columns=null;
        var data=null;
        if(dataResponse[0].facebook_id){
          columns = [
            { title: keyword("ct_url"), field: 'url' },
            { title: keyword("ct_sna_shares"), field: 'count' },
          ];
        //  console.log("FACEBOOK URL")
          data = dataResponse.map((obj) => {
            let newObj = {};
            newObj['url'] = obj.url;
            newObj['count'] = obj.shares;
            return newObj;
          })
        }
        else {
         // console.log("INSTA URL")

           columns = [
            { title: keyword("ct_url"), field: 'url' },
            { title: keyword("ct_sna_total_interactions"), field: 'count' },
          ];

          data = dataResponse.map((obj) => {
            let newObj = {};
            newObj['url'] = obj.url;
            newObj['count'] = obj.total_interactions;
            return newObj;
          })
        }
        
       // console.log("URL-data ",data)

  
        return {
          columns: columns,
          data: data,
        }
      }