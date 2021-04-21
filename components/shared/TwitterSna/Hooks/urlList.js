

    export const getJsonDataForURLTable = (dataResponse, keyword) => {
        let columns = [
          { title: keyword("elastic_url"), field: 'url' },
          { title: keyword("elastic_count"), field: 'count' },
        ];
  
        let data = dataResponse.map((obj) => {
          let newObj = {};
          newObj['url'] = obj['key'];
          newObj['count'] = obj['doc_count'];
          return newObj;
        })
        console.log("URL-data ",data)
        console.log("URL-columns",columns)

        return {
          columns: columns,
          data: data,
        }
      }