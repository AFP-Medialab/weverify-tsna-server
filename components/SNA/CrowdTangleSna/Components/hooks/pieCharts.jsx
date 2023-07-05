addEventListener("message", (event) => {
  if (event.data.type === "INSTA")
    postMessage({
      type: event.data.type,
      response: getJsonDataForPieChartsInsta(event.data.data),
    });
  else if (event.data.type === "FB")
    postMessage({
      type: event.data.type,
      response: getJsonDataForPieCharts(event.data.data),
    });
  else if (event.data.type === "BUILD")
    postMessage({
      type: event.data.type,
      response: createPieCharts(event.data.data[0], event.data.data[1]),
    });
});

const createPieCharts = (jsonPieCharts, keywordTitles) => {
  let layout = {
    title: {
      font: {
        family: "Arial, sans-serif",
        size: 18,
      },
      xanchor: "center",
    },
    annotations: [
      {
        xref: "paper",
        yref: "paper",
        x: 1.15,
        y: -0.2,
        text: "weverify.eu",
        showarrow: false,
      },
    ],
    automargin: true,
    width: 500,
    height: 500,
  };

  let config = {
    displayModeBar: false,
    toImageButtonOptions: {
      format: "png", // one of png, svg, jpeg, webp
      filename:
        "request.keywordList.join(" &
        (")" + "_" + "request.from" + "_" + "request.until" + "_Tweets"),
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtons: [["toImage"]],
    displaylogo: false,
  };

  const tips = [
    "ct_sna_most_retweet_tip",
    "ct_sna_most_likes_tip",
    "ct_sna_most_active_tip",
    "ct_sna_most_mentions_tip",
  ];

  let pieCharts = [];

  for (let cpt = 0; cpt < keywordTitles.length; cpt++) {
    let specificLayout = JSON.parse(JSON.stringify(layout));
    let specificTitle = keywordTitles[cpt];
    +"<br>" + " - " + "request[]" + " - ";
    specificLayout.title.text = specificTitle;
    pieCharts.push({
      title: keywordTitles[cpt],
      json: jsonPieCharts[cpt],
      layout: specificLayout,
      config: config,
      tip: tips[cpt],
    });
  }
  return pieCharts;
};

export const getJsonDataForPieChart = (
  dataResponse,
  paramKeywordList,
  specificGetCallBack,
) => {
  let labels = [];
  let parents = [];
  let value = [];

  let keys = dataResponse;

  if (keys.length === 0) return null;

  //Initialisation
  labels.push(paramKeywordList.join(", ").replace(/#/g, ""));
  parents.push("");
  value.push("");

  if (keys[0]["key"].charAt(0) === "#") keys.shift();
  keys.forEach((key) => {
    specificGetCallBack(
      key,
      value,
      labels,
      parents,
      paramKeywordList.join(", ").replace(/#/g, ""),
    );
  });

  let obj = [
    {
      type: "sunburst",
      labels: labels,
      parents: parents,
      values: value,
      textinfo: "label+value",
      outsidetextfont: { size: 20, color: "#377eb8" },
    },
  ];

  return obj;
};

const getJsonDataForPieCharts = (esResponse) => {
  let newmap = [];
  for (let i = 0; i < esResponse.length; i++) {
    let flag = 0;
    for (let y = 0; y < newmap.length; y++) {
      if (newmap[y].labels == esResponse[i].page_name) {
        newmap[y].shares += esResponse[i].shares;
        newmap[y].likes += esResponse[i].likes;
        newmap[y].comments += esResponse[i].comments;
        newmap[y].message += 1;
        flag = 1;
      }
    }
    if (flag == 0) {
      newmap.push({
        labels: esResponse[i].page_name
          ? esResponse[i].page_name
          : esResponse[i].group_name,
        shares: esResponse[i].shares,
        likes: esResponse[i].likes,
        comments: esResponse[i].comments,
        message: 1,
      });
    }
  }
  let result = [];
  for (let i = 0; i < 4; i++) {
    result.push([
      {
        type: "sunburst",
        labels: ["csv"],
        parents: [""],
        values: [""],
        textinfo: "label+value",
        outsidetextfont: {
          size: 20,
          color: "#377eb8",
        },
      },
    ]);
  }
  //most shares
  newmap.sort((a, b) => (a.shares < b.shares ? 1 : -1));
  for (let i = 0; i < 20; i++) {
    result[0][0].labels.push(newmap[i].labels);
    result[0][0].values.push(newmap[i].shares);
    result[0][0].parents.push("csv");
  }
  //most likes
  newmap.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  for (let i = 0; i < 20; i++) {
    result[1][0].labels.push(newmap[i].labels);
    result[1][0].values.push(newmap[i].likes);
    result[1][0].parents.push("csv");
  }
  //comments
  newmap.sort((a, b) => (a.comments < b.comments ? 1 : -1));
  for (let i = 0; i < 20; i++) {
    result[2][0].labels.push(newmap[i].labels);
    result[2][0].values.push(newmap[i].comments);
    result[2][0].parents.push("csv");
  }
  //message
  newmap.sort((a, b) => (a.message < b.message ? 1 : -1));
  for (let i = 0; i < 20; i++) {
    result[3][0].labels.push(newmap[i].labels);
    result[3][0].values.push(newmap[i].message);
    result[3][0].parents.push("csv");
  }
  return result;
};

const getJsonDataForPieChartsInsta = (esResponse, paramKeywordList) => {
  let newmap = [];
  for (let i = 0; i < esResponse.length; i++) {
    let flag = 0;
    for (let y = 0; y < newmap.length; y++) {
      if (newmap[y].labels == esResponse[i].account) {
        newmap[y].shares += esResponse[i].followers_at_posting;
        newmap[y].likes += esResponse[i].likes;
        newmap[y].comments += esResponse[i].comments;
        newmap[y].message += 1;
        flag = 1;
      }
    }
    if (flag == 0) {
      newmap.push({
        labels: esResponse[i].account,
        shares: esResponse[i].followers_at_posting,
        likes: esResponse[i].likes,
        comments: esResponse[i].comments,
        message: 1,
      });
    }
  }
  let result = [];
  for (let i = 0; i < 4; i++) {
    result.push([
      {
        type: "sunburst",
        labels: ["csv"],
        parents: [""],
        values: [""],
        textinfo: "label+value",
        outsidetextfont: {
          size: 20,
          color: "#377eb8",
        },
      },
    ]);
  }

  //most followers
  newmap.sort((a, b) => (a.shares < b.shares ? 1 : -1));

  let j = newmap.length > 20 ? 20 : newmap.length;
  for (let i = 0; i < j; i++) {
    result[0][0].labels.push(newmap[i].labels);
    result[0][0].values.push(newmap[i].shares);
    result[0][0].parents.push("csv");
  }
  //most likes
  newmap.sort((a, b) => (a.likes < b.likes ? 1 : -1));
  for (let i = 0; i < j; i++) {
    result[1][0].labels.push(newmap[i].labels);
    result[1][0].values.push(newmap[i].likes);
    result[1][0].parents.push("csv");
  }
  //comments
  newmap.sort((a, b) => (a.comments < b.comments ? 1 : -1));
  for (let i = 0; i < j; i++) {
    result[2][0].labels.push(newmap[i].labels);
    result[2][0].values.push(newmap[i].comments);
    result[2][0].parents.push("csv");
  }
  //message
  newmap.sort((a, b) => (a.message < b.message ? 1 : -1));
  for (let i = 0; i < j; i++) {
    result[3][0].labels.push(newmap[i].labels);
    result[3][0].values.push(newmap[i].message);
    result[3][0].parents.push("csv");
  }
  return result;
};

//Download as SVG

export function createCSVFromPieChart(obj) {
  let csvArr = "Sector,Count\n";
  for (let i = 1; i < obj.json[0].labels.length; i++) {
    csvArr += obj.json[0].labels[i] + "," + obj.json[0].values[i] + "\n";
  }
  return csvArr;
}
