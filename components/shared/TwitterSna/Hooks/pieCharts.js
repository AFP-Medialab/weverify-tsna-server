export const createPieCharts = (request, jsonPieCharts, keyword) => {
  
    let layout = {
      title: {
        font: {
          family: 'Arial, sans-serif',
          size: 18
        },
        xanchor: 'center'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 1.15,
        y:-0.2,
        text: 'weverify.eu',
        showarrow: false
        },
        ],
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
      let specificTitle = keyword(keywordTitles[cpt]); + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"];
      specificLayout.title.text = specificTitle;
      pieCharts.push(
        {
          title: keywordTitles[cpt],
          json: jsonPieCharts[cpt],
          layout: specificLayout,
          config: config,
          tip: tips[cpt]
        }
      );
    }
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
    if (esResponse["top_user_favorite"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_favorite"]["buckets"], paramKeywordList, topBySum));
    }
    if (esResponse["top_user"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user"]["buckets"], paramKeywordList, topByCount));
    }
    if (esResponse["top_user_mentions"]) {
      jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_mentions"]["buckets"], paramKeywordList, topByCount));
    }

    return jsonPieCharts;
  }

//Download as SVG


export function createCSVFromPieChart(obj) {
  let csvArr = "Sector,Count\n";
  for (let i = 1; i < obj.json[0].labels.length; i++) {
      csvArr += obj.json[0].labels[i] + "," + obj.json[0].values[i] + "\n";
  }
  return csvArr;
}