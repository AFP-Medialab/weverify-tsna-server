import {mergeUrlsAndourceCredibilityResults} from '../../lib/gateProcessingApi';

    export const getJsonDataForURLTable = async (dataResponse, keyword) => {
        let columns = [
          { title: keyword("elastic_url"), field: 'url' },
          { title: keyword("elastic_count"), field: 'count' },
          { title: keyword("sna_credibility"), field: 'credibility' },
        ];
        //call credibility
        let urls = dataResponse.map((obj) =>{
          let newObj = {};
          newObj['url'] = obj['key'];
          return newObj;
        });
        let query = urls.map((obj) => obj['url']).join("\n");
        const response = await fetch("/api/gate/credibility", {
          method: 'POST',
          body: query,
          headers: {
              'Content-Type': 'text/plain'
          }
      });
      const serviceResponse = await response.json();
      let data = mergeUrlsAndourceCredibilityResults(dataResponse, serviceResponse);
      console.log("data w credibility", data);

        /*let data = dataResponse.map((obj) => {
          let newObj = {};
          newObj['url'] = obj['key'];
          newObj['count'] = obj['doc_count'];
          newObj['credibility'] = obj['credibility']
          return newObj;
        })*/
        
  
        return {
          columns: columns,
          data: data,
        }
      }