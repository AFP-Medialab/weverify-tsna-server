export const createTimeLineChart = (date_min, date_max, json, titleLabel, timeLabel) => {

  const range_min = date_min.slice(0, -4);
  const range_max = date_max.slice(0, -4);

    let layout = {
      title: titleLabel + "<br>" + date_min + " - " + date_max,
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
        text: timeLabel,
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

export const getJsonDataForTimeLineChartFb = (data) => {
  let datas = data;
  var infos = [];
  let min_epoch = 9999999999999999;
  let min_CET = "";
  let max_epoch = 0;
  let max_CET = "";
  const usersGet = (dateObj, infos, tot_inte, date_epoch) => {
      infos.push({
        date: date_epoch,
        key: dateObj.page_name,
        nb: tot_inte,
    });
    return infos;
  }
  var getEpochMillis = function(dateStr) {
    
    var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CET\s*$/
      , m = (""+dateStr).match(r);
    return (m) ? Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]) : undefined;
  };
  datas.forEach(dateObj => {
    let tot_inte = 0;
    if (typeof dateObj.total_interactions === 'string')
    {
      tot_inte = parseInt(dateObj.total_interactions.replace(/,/g, ''));
    }
    else{
      tot_inte = dateObj.total_interactions;
    }
    let date_epoch = getEpochMillis(dateObj.created);
    if (date_epoch < min_epoch)
    {
      min_epoch = date_epoch;
      min_CET = dateObj.created;
    }
    if (date_epoch > max_epoch)
    {
      max_epoch = date_epoch;
      max_CET = dateObj.created;
    }
    usersGet(dateObj, infos, tot_inte, date_epoch); // pour chaque user, on recupe l'obj avec nom tot_interact date
    infos.push({
      date: date_epoch,
      key: "Posts",                    //nb de posts
      nb: tot_inte,         //au format epoch
    });
    infos.push({
      date: date_epoch,
      key: "Shares",                   //nb de shares
      nb: tot_inte,
    });
  });
  var lines = [];
  infos.sort((a, b) => (a.date > b.date) ? 1 : -1);
  while (infos.length !== 0) {
    let info = infos.pop();
    let date = info.date;
    let nb = info.nb;
    var type = "markers";
    if (info.key === "Posts" || info.key === "Shares")
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
  return [lines, min_CET, max_CET];
};
export const getJsonDataForTimeLineChartInsta = (data) => {
  let datas = data;
  var infos = [];
  let min_epoch = 9999999999999999;
  let min_CET = "";
  let max_epoch = 0;
  let max_CET = "";
  const usersGet = (dateObj, infos, tot_inte, date_epoch) => {
      infos.push({
        date: date_epoch,
        key: dateObj.account,
        nb: tot_inte,
    });
    return infos;
  }
  var getEpochMillis = function(dateStr) {
    
    var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CET\s*$/
      , m = (""+dateStr).match(r);
    return (m) ? Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]) : undefined;
  };
  datas.forEach(dateObj => {
    let tot_inte = 0;
    if (typeof dateObj.total_interactions === 'string')
    {
      tot_inte = parseInt(dateObj.total_interactions.replace(/,/g, ''));
    }
    else{
      tot_inte = dateObj.total_interactions;
    }
    let date_epoch = getEpochMillis(dateObj.created);
    if (date_epoch < min_epoch)
    {
      min_epoch = date_epoch;
      min_CET = dateObj.created;
    }
    if (date_epoch > max_epoch)
    {
      max_epoch = date_epoch;
      max_CET = dateObj.created;
    }
    usersGet(dateObj, infos, tot_inte, date_epoch); // pour chaque user, on recupe l'obj avec nom tot_interact date
    infos.push({
      date: date_epoch,
      key: "Posts",                    //nb de posts
      nb: tot_inte,         //au format epoch
    });
    infos.push({
      date: date_epoch,
      key: "Shares",                   //nb de shares
      nb: tot_inte,
    });
  });
  var lines = [];
  infos.sort((a, b) => (a.date > b.date) ? 1 : -1);
  while (infos.length !== 0) {
    let info = infos.pop();
    let date = info.date;
    let nb = info.nb;
    var type = "markers";
    if (info.key === "Posts" || info.key === "Shares")
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
  return [lines, min_CET, max_CET];
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
