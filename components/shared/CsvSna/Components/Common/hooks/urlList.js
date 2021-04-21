


    export const getJsonDataForURLTable = (dataResponse, keyword) => {
        var columns=null;
        var data=null;
        if(dataResponse[0].facebook_id){
          columns = [
            { title: keyword("elastic_url"), field: 'url' },
            { title: keyword("csv_sna_shares"), field: 'count' },
          ];
          console.log("FACEBOOK URL")
          data = dataResponse.map((obj) => {
            let newObj = {};
            newObj['url'] = obj.url;
            newObj['count'] = obj.shares;
            return newObj;
          })
        }
        else {
          console.log("INSTA URL")

           columns = [
            { title: keyword("elastic_url"), field: 'url' },
            { title: keyword("csv_sna_total_interactions"), field: 'count' },
          ];

          data = dataResponse.map((obj) => {
            let newObj = {};
            newObj['url'] = obj.url;
            newObj['count'] = obj.total_interactions;
            return newObj;
          })
        }
        
        console.log("URL-data ",data)

  
        return {
          columns: columns,
          data: data,
        }
      }