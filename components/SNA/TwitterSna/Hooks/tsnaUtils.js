export function widgetTitle(request){ 
    //console.log("request  .... ", request)

    /*let nameTitle = request.keywordList.join(", ") + request.keywordAnyList.join(", ")
    if (nameTitle.length > 90){
        nameTitle = nameTitle.substr(0,90) + "...";
    }*/

    let title = request.keywordList.join(" and ")
    title += request.keywordList.length === 0 ? "" :" - " 
    title += request.keywordAnyList.join(" or ") 
    title +=  request.keywordAnyList.length === 0 ? "" :" - " 
    title += request.bannedWords.length === 0 ? "" : " not "
    title += request.bannedWords.join(", ")
    title += request.bannedWords.length === 0 ? "" : " - "
    title += request.userList.length === 0 ? "" : "user : "
    title += request.userList.join(", ")
    title += "<br />"
    title += request["from"] + " - " + request["until"]
    return title;
}

export function widgetPieTitle(request){ 

    let title = request.keywordList.join(", ").replace(/#/g, "")
    title += request.keywordList.length === 0 ? "" :" - " 
    title += request.keywordAnyList.join(" or ").replace(/#/g, "")
    title += request.bannedWords.length === 0 ? "" : " not "
    title += request.bannedWords.join(", ").replace(/#/g, "")
    return title;
}


export function widgetFilename(request, sourceLabel){
    let filename = request.keywordList.join("_and_")
    filename += request.keywordList.length === 0 ? "" :"-" 
    filename += request.keywordAnyList.join("_or_") 
    filename += request.keywordAnyList.length === 0 ? "" :"-" 
    filename += request["from"] + "-" + request["until"]
    filename += sourceLabel
    return filename;
}

export function widgetSimpleFilename(request){
    let filename = request.keywordList.join("_and_")
    filename += request.keywordList.length === 0 ? "" :"-" 
    filename += request.keywordAnyList.join("_or_") 
    filename += request.keywordAnyList.length === 0 ? "" :"-" 
    filename += request["from"] + "-" + request["until"]
    return filename;
}