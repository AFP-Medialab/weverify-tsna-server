
export function filterForTimeLine(postDate, selectedPoints) {
    for (let i = 0; i < selectedPoints.length; i++) {
        let pointedDate = new Date(selectedPoints[i].x);
        if (selectedPoints[i].data.mode !== "lines" && isInRange(pointedDate, postDate, "isDays")) {
            return true;
        };
    }
  }

  function normalizeDate(date){
      if(date.endsWith("CEST"))
        return date.slice(0, -4);
      return date;
  }

  export const createTimeLineChart = (date_min, date_max, json, titleLabel, timeLabel, full_fileName) => {
    //console.log("date_min " , date_min);
    //console.log("date_max " , date_max);
    const range_min = normalizeDate(date_min);
    const range_max = normalizeDate(date_max);

    //console.log("JSON 2", json);
  
      let layout = {
        title: titleLabel,
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
          filename: full_fileName,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
          },
  
          responsive: true,
          modeBarButtons: [["toImage"], ["resetScale2d"]],
          displaylogo: false,
      };
      json.map((obj) => {
        //console.log("DATE", obj);
          obj.x = obj.x.map((timestamp) => {
            //console.log("DATE", timestamp);
            if (timestamp!== undefined && timestamp.length === 10)
              return new Date(parseInt(timestamp) * 1000)
            else return new Date(parseInt(timestamp));
          });
          return obj;
      })
      return {
          title: "ct_user_time_chart_title",
          json: json,
          layout: layout,
          config: config,
          tweetsView: null,
      };
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