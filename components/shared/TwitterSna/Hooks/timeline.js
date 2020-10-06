

export const createTimeLineChart = (request, json) => {

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    let layout = {
        title: keyword("user_time_chart_title") + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"],
        automargin: true,
        xaxis: {
        range: [request.from, request.until],
        rangeslider: { range: [request.from, request.until] },
        },
        annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 1.15,
        xanchor: 'right',
        y: -0.4,
        yanchor: 'top',
        text: 'we-verify.eu',
        showarrow: false
        },
        {
        xref: 'paper',
        yref: 'paper',
        x: 1.15,
        xanchor: 'right',
        y: -0.6,
        yanchor: 'top',
        text: keyword('twitter_local_time'),
        showarrow: false
        }],
        autosize: true,
    };
    let config = {
        displayModeBar: true,
        toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Timeline",
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },

        responsive: true,
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
    };
    json.map((obj) => {
        obj.x = obj.x.map((timestamp) => {return new Date(parseInt(timestamp) * 1000)});
        return obj;
    })
    return {
        title: "user_time_chart_title",
        json: json,
        layout: layout,
        config: config,
        tweetsView: null,
    };
};
export const getJsonDataForTimeLineChart = (dataResponse) => {
    let dates = dataResponse;

    var infos = [];

    const usersGet = (dateObj, infos) => {
      dateObj["3"]["buckets"].forEach(obj => {
        infos.push({
          date: obj["dt"]['buckets']['0']['key_as_string'],
          key: obj["key"],
          nb: obj["rt"]["value"]
        })
      });

      return infos;
    }

    dates.forEach(dateObj => {
      usersGet(dateObj, infos);
      infos.push({
        date: dateObj['key_as_string'],
        key: "Tweets",
        nb: dateObj["doc_count"],
      });
      infos.push({
        date: dateObj['key_as_string'],
        key: "Retweets",
        nb: dateObj["1"]["value"]
      });
    });

    var lines = [];
    while (infos.length !== 0) {

      let info = infos.pop();
      let date = info.date;
      let nb = info.nb;
      var type = "markers";
      if (info.key === "Tweets" || info.key === "Retweets")
        type = 'lines';
      let plotlyInfo = {
        mode: type,
        name: info.key,
        x: [],
        y: []
      }

      for (let i = 0; i < infos.length; ++i) {
        if (infos[i].key === info.key) {
          plotlyInfo.x.push(infos[i].date);
          plotlyInfo.y.push(infos[i].nb);
          infos.splice(i, 1);
          i--;
        }
      }
      plotlyInfo.x.push(date);
      plotlyInfo.y.push(nb);
      lines.push(plotlyInfo);
    }

    return lines;
  };