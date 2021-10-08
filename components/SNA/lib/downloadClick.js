export function downloadClick(request, csvArr, name, histo, type = "Tweets_") {
    let encodedUri = encodeURIComponent(csvArr);
    let link = document.createElement("a");
    link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
    link.setAttribute("download", type + name + "_" + request.keywordList.join('&') + '_' + ((!histo) ? (request.from + "_" + request.until) : "") + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


