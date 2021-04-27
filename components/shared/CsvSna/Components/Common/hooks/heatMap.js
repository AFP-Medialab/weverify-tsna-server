


export function displayPostsInsta (filteredTweets, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
        ];
    } else if (sortedColumn === "total_interactions") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
        ];
    } else {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'post'},
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
        ];
    }

    let csvArr = keyword("twittersna_result_date") + ',' 
                + keyword("twittersna_result_username") + ',' 
                + keyword("twittersna_result_tweet") + ',' 
                + keyword('twittersna_result_like_nb') + ',' 
                + keyword("csv_sna_total_interactions") + ',' 

    let resData = [];
    filteredTweets.forEach(postObj => {
        const date = new Date(new_date(postObj.created));

        resData.push(
            {
                date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                screen_name: <a href={"https://instagram.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
                post: postObj.description,
                nbLikes: postObj.likes,
                total_interactions: postObj.total_interactions,
                link: <a href={postObj.link} target="_blank" rel="noopener noreferrer" >{postObj.link} </a>
            }
        );
        csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',' +
                    postObj.user_name + ',"' 
                    + postObj.description + '",' 
                    + postObj.likes + ','
                    + postObj.total_interactions + ',' 
                    + "https://instagram.com/" + postObj.link + "/status/" + postObj.user_name + '\n';
    });

    return {
        data: resData,
        columns: columns,
        csvArr: csvArr,
    };
};



export function displayPostsFb (filteredTweets, keyword, sortedColumn) {
  let columns = [];
  if (sortedColumn === "nbLikes") {
    columns = [
      { title: keyword('twittersna_result_date'), field: 'date'},
      { title: keyword('twittersna_result_username'), field: 'screen_name'},
      { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
      { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
      { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
      { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
  ];
  } else if (sortedColumn === "retweetNb") {
    columns = [
      { title: keyword('twittersna_result_date'), field: 'date'},
      { title: keyword('twittersna_result_username'), field: 'screen_name'},
      { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
      { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
      { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
      { title: keyword('csv_sna_total_interactions'), field: 'total_interactions', defaultSort: "desc" },
  ];
  } else {
    columns = [
      { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
      { title: keyword('twittersna_result_username'), field: 'screen_name'},
      { title: keyword('twittersna_result_tweet'), field: 'post'/*, render: getPostWithClickableLink*/ },
      { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
      { title: keyword('twittersna_result_retweet_nb'), field: 'shares'},
      { title: keyword('csv_sna_total_interactions'), field: 'total_interactions'},
      
  ];
  }

  let csvArr = keyword("twittersna_result_date") + ',' 
              + keyword("twittersna_result_username") + ',' 
              + keyword("twittersna_result_tweet") + ',' 
              + keyword('twittersna_result_like_nb') + ',' 
              + keyword("csv_sna_total_interactions") + ',' 
              + keyword("twittersna_result_retweet_nb") +'\n';

  let resData = [];
  filteredTweets.forEach(postObj => {
      //const date = getEpochMillis(postObj.created);
      const date = new Date(new_date(postObj.created));

      resData.push(
          {
              date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
              screen_name: <a href={"https://facebook.com/" + postObj.user_name} target="_blank" rel="noopener noreferrer">{postObj.user_name}</a>,
              tweet: postObj.description,
              nbLikes: postObj.likes,
              total_interactions: postObj.total_interactions,
              shares: postObj.shares,
              link: <a href={postObj.link} target="_blank" rel="noopener noreferrer" >{postObj.link} </a>
          }
      );
      csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',' +
                  postObj.user_name + ',"' 
                  + postObj.description + '",' 
                  + postObj.likes + ','
                  + postObj.total_interactions + ',' 
                  + "https://facebook.com/" + postObj.link + "/status/" + postObj.user_name + '\n';
  });

  return {
      data: resData,
      columns: columns,
      csvArr: csvArr,
  };
};






var new_date = function(dateStr) {
  var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CET\s*$/
    , m = (""+dateStr).match(r);
  return `${m[1]}-${m[2]}-${m[3]}" "${m[4]}:${m[5]}:${m[6]}`;
};
export const onHeatMapClick = (data, result, setheatMapTweets, keyword) => {

    let selectedHour = data.points[0].x;

    let selectedDay = data.points[0].y;
    let filteredTweets = result.data.filter(function (postObj) {
      let date = new Date(new_date(postObj.created));
        let day = getDayAsString(date.getDay());
        let hour = getHourAsString(date.getHours());
        return hour === selectedHour && day === selectedDay;
    });
    var res =null;
    if (result.data[0].facebook_id){
      console.log("FACEBOOK")
     
      res = displayPostsFb(filteredTweets, keyword);

  }
  else
  {
      console.log("INSTA")
      res = displayPostsInsta(filteredTweets, keyword);

  }

    setheatMapTweets(res);
}

export function getDayAsString(dayInt) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayInt];
}

function getHourAsString(hourInt) {
    return ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'][hourInt];
}

function getDayAsInt(dayString) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayString);
  }

  
  

function getNbTweetsByHourDay(dayArr, hourArr, bucket) {
    // 1D-array with elements as day_hour 
    let dayHourArr = bucket.map(function (val, ind) {
    
    
      
      const date = new Date(new_date(val.created));


      return `${date.getDay()}_${date.getHours()}`;
    });
  
    // Groupby day_hour
    let nbTweetArr = _.countBy(dayHourArr);
  //  console.log("NBTWEET", nbTweetArr)
    // Convert 1D-array to 2D-array
    let nbTweetArr2D = [...Array(dayArr.length)].map(e => Array(hourArr.length).fill(0));
    //console.log("NBTWEET2D", nbTweetArr2D)

    Object.entries(nbTweetArr).forEach(nbTweet => {
      let day = parseInt(nbTweet[0].split("_")[0]);
      let hour = parseInt(nbTweet[0].split("_")[1]);
      nbTweetArr2D[day][hour] = nbTweet[1];
    //  console.log("NBTWEET2DDD", nbTweetArr2D[day][hour])

    });
    // Re-order rows according to dayArr
    let orderedNbTweetArr2D = [];
    dayArr.forEach(dayStr => {
      let dayInt = getDayAsInt(dayStr);
      orderedNbTweetArr2D.push(nbTweetArr2D[dayInt])
    });
  
    return orderedNbTweetArr2D;
  }


export function createHeatMap(request, hits, keyword) {

    let hourAxis = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    let dayAxis = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let isAllnul = true; // All cells are null
    if (hits.length !== 0) {
      isAllnul = false;
    }
    // 2D-array with cells as number of tweets by day and hour
    let nbTweetArr2D = getNbTweetsByHourDay(dayAxis, hourAxis, hits);

    let config = {
      displayModeBar: true,
      toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: "request.keywordList.join("&")" + "_" + "request" + "_" + "request" + "_Heatmap",
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      responsive: true,
      modeBarButtons: [["toImage"], ["resetScale2d"]],
      displaylogo: false,
    }

    let layout = {
      title: {
        text: keyword("heatmap_chart_title")  /*+ "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"] */,
        font: {
          family: 'Arial, sans-serif',
          size: 18
        },
        xanchor: 'center'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 1,
        y:-0.2,
        text: 'weverify.eu',
        showarrow: false
        },
        ],
    }

    return {
      plot: [{
        z: nbTweetArr2D,
        x: hourAxis,
        y: dayAxis,
        colorscale: [[0.0, 'rgb(247,251,255)'], [0.125, 'rgb(222,235,247)'], [0.25, 'rgb(198,219,239)'],
        [0.375, 'rgb(158,202,225)'], [0.5, 'rgb(107,174,214)'], [0.625, 'rgb(66,146,198)'],
        [0.75, 'rgb(33,113,181)'], [0.875, 'rgb(8,81,156)'], [1.0, 'rgb(8,48,107)']],
        type: 'heatmap'
      }],
      config: config,
      layout: layout,
      isAllnul: isAllnul
    };
  }

  