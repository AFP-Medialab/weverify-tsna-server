import { createTimeLineChart } from "../../../Hooks/timeline";

export const createTimeLineChart4CT = (date_min, date_max, json, titleLabel, timeLabel, full_fileName) => {
  return createTimeLineChart(date_min, date_max, json, titleLabel, timeLabel, full_fileName);
}

export const getEpochMillis = (dateStr) => {
    
  var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CES*T\s*$/
    , m = (""+dateStr).match(r);

  return (m) ? Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]) : undefined;
};

export const getJsonDataForTimeLineChart = (data) => {
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

  datas.forEach(dateObj => {
    let tot_inte = 0;
    if (typeof dateObj.total_interactions === 'string')
    {
      tot_inte = parseInt(dateObj.total_interactions.replace(/,/g, ''));
    }
    else{
      tot_inte = dateObj.total_interactions;
    }
    let date_epoch = getEpochMillis(dateObj.post_created);
    if (date_epoch < min_epoch)
    {
      min_epoch = date_epoch;
      min_CET = dateObj.post_created;
    }
    if (date_epoch > max_epoch)
    {
      max_epoch = date_epoch;
      max_CET = dateObj.post_created;
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



