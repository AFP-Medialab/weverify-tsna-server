import getConfig from 'next/config';
import {mergeUrlsAndourceCredibilityResults} from '../lib/gateProcessingApi';
import Link from "@material-ui/core/Link";

const { publicRuntimeConfig } = getConfig();
  
  let credibility_url = `${publicRuntimeConfig.baseFolder}/api/gate/credibility`;

  export const getJsonDataForURLTable = async (dataResponse, labels, keys, credibility = false) => {
    let columns = [
      { title: labels.url, field: 'url', render: rowData => <Link target="_blank" href={rowData.url}>{rowData.url}</Link>},
      { title: labels.count, field: 'count', type: "numeric" },
      { title: labels.credibility, field: 'credibility' },
    ];
    //call credibility
    let urls = dataResponse.map((obj) =>{
      let newObj = {};
      newObj['url'] = obj[keys.url];
      return newObj;
    });
    
    let query = urls.map((obj) => obj['url']).join("\n");
    //console.log('query', query);
    let data = {};
    if(credibility){
      try{
        const response = await fetch(credibility_url, {
          method: 'POST',
          body: query,
          headers: {
              'Content-Type': 'text/plain'
          }
      });
        const serviceResponse = await response.json();
        data = mergeUrlsAndourceCredibilityResults(dataResponse, serviceResponse, keys);
        console.log("data w credibility", data);
      }
      catch (error) {
        console.log("Error call service ", error)
        data = dataResponse.map((obj, index) => {
          let newObj = {};
          newObj['id'] = index;
          newObj['url'] = obj[keys.url];
          newObj['count'] = obj[keys.count];
          newObj['credibility'] = obj['credibility']
          return newObj;
        })
      }
    }
    return {
      columns: columns,
      data: data,
    }
}