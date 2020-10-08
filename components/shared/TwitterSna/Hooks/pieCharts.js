


export const createPieCharts = (request, jsonPieCharts, keyword) => {
    let layout = {
      title: {
        font: {
          family: 'Arial, sans-serif',
          size: 18
        },
        xanchor: 'center'
      },
      automargin: true,
      width: 500,
      height: 500
    };

    let config = {
      displayModeBar: true,
      toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: request.keywordList.join("&") + "_" + request.from + "_" + request.until + "_Tweets",
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtons: [["toImage"]],
      displaylogo: false
    };

    let keywordTitles = [
      "retweets_cloud_chart_title",
      "likes_cloud_chart_title",
      "top_users_pie_chart_title",
      "mention_cloud_chart_title"
    ];

    let tips = [
      "twittersna_most_retweet_tip",
      "twittersna_most_likes_tip",
      "twittersna_most_active_tip",
      "twittersna_most_mentions_tip"
    ]

    let pieCharts = [];

    for (let cpt = 0; cpt < keywordTitles.length; cpt++) {
      let specificLayout = JSON.parse(JSON.stringify(layout));
      let specificTitle = keyword("mention_cloud_chart_title") + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"];
      specificLayout.title.text = specificTitle;
      pieCharts.push(
        {
          title: "mention_cloud_chart_title",
          json: jsonPieCharts[cpt],
          layout: specificLayout,
          config: config,
          tip: tips[cpt]
        }
      );
    }
    console.log("pie : "+ pieCharts)
    return pieCharts;
  };

  export const getJsonDataForPieChart = (dataResponse, paramKeywordList, specificGetCallBack) => {

    let labels = [];
    let parents = [];
    let value = [];

    let keys = dataResponse;

    if (keys.length === 0)
        return null;

        //Initialisation
    labels.push(paramKeywordList.join(', ').replace(/#/g, ''));
    parents.push("");
    value.push("");

    if (keys[0]['key'].charAt(0) === '#')
        keys.shift();
    keys.forEach(key => {
        specificGetCallBack(key, value, labels, parents, paramKeywordList.join(', ').replace(/#/g, ''));
    });
    
    let obj = [{
        type: "sunburst",
        labels: labels,
        parents: parents,
        values: value,
        textinfo: "label+value",
        outsidetextfont: {size: 20, color: "#377eb8"},
    }];

    console.log("getjsonfrompie = " + obj);
    return obj;
  }

  export const getJsonDataForPieCharts = (esResponse, paramKeywordList) => {

    function topByCount(key, values, labels, parents, mainKey) {
      if (key["doc_count"] > 0) {
        values.push(key["doc_count"]);
        labels.push(key["key"]);
        parents.push(mainKey);
      }
    }

    function topBySum(key, values, labels, parents, mainKey) {
      if (key["_1"]["value"] > 10) {
        values.push(key["_1"]["value"]);
        labels.push(key["key"]);
        parents.push(mainKey);
      }
    }

    let jsonPieCharts = [];
    if (esResponse["top_user_retweet"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_retweet"]["buckets"], paramKeywordList, topBySum));
    }
    if (esResponse["top_u, queryTweetsFromES, continueQueryTweetsFromESWhenMore10k, er"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user"]["buckets"], paramKeywordList, topByCount));
    }
    if (esResponse["top_user_mentions"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_mentions"]["buckets"], paramKeywordList, topByCount));
    }

    return jsonPieCharts;
  }

  export const onDonutsClick = (data, index) => {

    //For mention donuts
    if (index === 3) {
        if (result.tweets !== undefined) {
            let selectedUser = data.points[0].label;
            let filteredTweets = result.tweets.filter(tweet => tweet._source.user_mentions !== undefined && tweet._source.user_mentions.length > 0)
                .filter(function (tweet) {
                    let lcMentionArr = tweet._source.user_mentions.map(v => v.screen_name.toLowerCase());
                    return lcMentionArr.includes(selectedUser.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = selectedUser;
            setPieCharts3(dataToDisplay);
        }
    }
    // For retweets, likes, top_user donut
    else {
        if (result.tweets !== undefined) {
            let selectedUser = data.points[0].label;
            let filteredTweets = result.tweets.filter(function (tweetObj) {
                return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
            });
            let dataToDisplay = index === 0 ? displayTweets(filteredTweets, "retweetNb") : (index === 1 ? displayTweets(filteredTweets, "nbLikes") : displayTweets(filteredTweets));

            dataToDisplay["selected"] = selectedUser;
            switch (index) {
                case 0:
                    setPieCharts0(dataToDisplay);
                    break;
                case 1:
                    setPieCharts1(dataToDisplay);
                    break;
                case 2:
                    setPieCharts2(dataToDisplay);
                    break;
                default:
                    break;
            }
        }
    }

};

//Download as SVG
export function downloadAsSVG(elementId) {

  if (elementId === "top_words_cloud_chart") {
      let name = filesNames + '.svg';
      var svgEl = document.getElementById("top_words_cloud_chart").children[0].children[0];
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      var svgData = svgEl.outerHTML;
      var preface = '<?xml version="1.0" standalone="no"?>\r\n';
      var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
      var svgUrl = URL.createObjectURL(svgBlob);
      var downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = name;
      downloadLink.click();
  } else {
      let element = document.getElementById(elementId);
      let positionInfo = element.getBoundingClientRect();
      let height = positionInfo.height;
      let width = positionInfo.width;
      let name = keyword(elementId) + filesNames.replace("WordCloud", "");
      Plotly.downloadImage(elementId,
          { format: 'svg', width: width * 1.2, height: height * 1.2, filename: name }
      );
  }

}

export function createCSVFromPieChart(obj) {
  let csvArr = "Sector,Count\n";
  for (let i = 1; i < obj.json[0].labels.length; i++) {
      csvArr += obj.json[0].labels[i] + "," + obj.json[0].values[i] + "\n";
  }
  return csvArr;
}

   //Download as PNG
export function downloadAsPNG(elementId) {
    let element = document.getElementById(elementId);

    if (elementId === "top_words_cloud_chart") {
        let name = filesNames + '.png';
        saveSvgAsPng(element.children[0].children[0], name, { backgroundColor: "white", scale: 2 });
    } else {
        let positionInfo = element.getBoundingClientRect();
        let height = positionInfo.height;
        let width = positionInfo.width;
        let name = keyword(elementId) + filesNames.replace("WordCloud", "") + '.png';
        Plotly.downloadImage(elementId,
            { format: 'png', width: width * 1.2, height: height * 1.2, filename: name }
        );
    }
}