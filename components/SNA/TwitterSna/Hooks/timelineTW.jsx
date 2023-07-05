export const getJsonDataForTimeLineChart = (dataResponse) => {
  let dates = dataResponse;

  var infos = [];

  const usersGet = (dateObj, infos) => {
    dateObj["3"]["buckets"].forEach((obj) => {
      infos.push({
        date: obj["dt"]["buckets"]["0"]["key_as_string"],
        key: obj["key"],
        nb: obj["rt"]["value"],
      });
    });

    return infos;
  };

  dates.forEach((dateObj) => {
    usersGet(dateObj, infos);
    infos.push({
      date: dateObj["key_as_string"],
      key: "Tweets",
      nb: dateObj["doc_count"],
    });
    infos.push({
      date: dateObj["key_as_string"],
      key: "Retweets",
      nb: dateObj["1"]["value"],
    });
  });

  var lines = [];
  while (infos.length !== 0) {
    let info = infos.pop();
    let date = info.date;
    let nb = info.nb;
    var type = "markers";
    if (info.key === "Tweets" || info.key === "Retweets") type = "lines";
    let plotlyInfo = {
      mode: type,
      name: info.key,
      x: [],
      y: [],
    };

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
