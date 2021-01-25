export const createTimeLineChart = (date_min, date_max, json, keyword) => {

  const range_min = date_min.slice(0, -4);
  const range_max = date_max.slice(0, -4);

    let layout = {
        title: keyword("user_time_chart_title") + "<br>" + "FACEBOOK CSV NAME" + " - " + date_min + " - " + date_max,
        automargin: true,
        xaxis: {
          range: [range_min, range_max],
          rangeslider: { range: [range_min, range_max] },
        },
        annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 1.15,
        xanchor: 'right',
        y: -0.4,
        yanchor: 'top',
        text: 'weverify.eu',
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
        filename: "FACEBOOK CSV NAME" + "_" + date_max + "_" + date_max + "_Timeline",
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },

        responsive: true,
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
    };
    json.map((obj) => {
        obj.x = obj.x.map((timestamp) => {return new Date(parseInt(timestamp))});
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

  export function isInRange(pointDate, objDate, periode) {

    if (periode === "isHours") {
        return (((pointDate.getDate() === objDate.getDate()
            && pointDate.getHours() - 1 === objDate.getHours()))
            && pointDate.getMonth() === objDate.getMonth()
            && pointDate.getFullYear() === objDate.getFullYear());
    }
    else {
        return (pointDate - objDate) === 0;
    }
}

export function filterTweetsForTimeLine(tweetDate, selectedPoints) {
  for (let i = 0; i < selectedPoints.length; i++) {
      let pointedDate = new Date(selectedPoints[i].x);
      if (selectedPoints[i].data.mode !== "lines" && isInRange(pointedDate, tweetDate, "isDays")) {
          return true;
      };
  }
}
