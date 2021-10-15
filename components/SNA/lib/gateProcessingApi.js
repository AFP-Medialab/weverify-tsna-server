import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

export const mergeUrlsAndourceCredibilityResults = (urls, originalResult, keys) => {
    let sourceCredibility = [];
    if(originalResult.entities.SourceCredibility)
        sourceCredibility = originalResult.entities.SourceCredibility
   
    sourceCredibility.forEach(dc => {
        delete dc["indices"];
    })
    sourceCredibility = uniqWith(sourceCredibility, isEqual)
    sourceCredibility = sourceCredibility.map((item) => {
        if(item.debunks !== undefined){
            let debunkArr = item.debunks.slice(0, -1).substring(1).split(",")
            return {...item, debunks: debunkArr}
        }else {
            return item
        }
    })
    
    let data = urls.map((obj, index) => {
        let newObj = {};
        newObj['id'] = index;
        newObj['url'] = obj[keys.url];
        newObj['count'] = obj[keys.count];
        let scresult = sourceCredibility.filter((ft) =>{
            return ft["string"] === obj[keys.url];
        });
        if(scresult.length > 0){
            newObj['credibility_details'] = scresult;
            if(scresult[0].type === "fact checker"){
                newObj['credibility'] = 'OK';
            }
            else{
                newObj['credibility'] = 'KO';
            }
        }else{
            newObj['credibility'] = null;
        }
        return newObj;
    });
    return data;
}
//not use get from dev-assistant
export const filterSourceCredibilityResults = (originalResult) => {
    let sourceCredResult = []
    let factCheckerResult = []

    if(!(originalResult.entities.SourceCredibility)) {return [sourceCredResult, factCheckerResult]}

    let sourceCredibility = originalResult.entities.SourceCredibility

    sourceCredibility.forEach(dc => {
        delete dc["indices"]
    })
    sourceCredibility = uniqWith(sourceCredibility, isEqual)

    sourceCredibility.forEach(result => {
        if(result["type"] === "fact checker"){
            factCheckerResult.push({
                "credibility_source": result["source"],
                "credibility_labels": result["type"],
                "credibility_description": result["description"],
                "credibility_string" : result["string"],
                "credibility_resolved-url" : result["resolved-url"]
            })
        }
        else {
            sourceCredResult.push({
                "credibility_source": result["source"],
                "credibility_labels": result["type"],
                "credibility_description": result["description"],
                "credibility_string" : result["string"],
                "credibility_resolved-url" : result["resolved-url"]
            })
        }
    })

    return [sourceCredResult, factCheckerResult]
}