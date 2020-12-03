import _ from "lodash";

const getTweetWithClickableLink = (cellData) => {
    let urls = cellData.tweet.match(/((http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*))/g);
    if (urls === null)
        return cellData.tweet;

    let tweetText = cellData.tweet.split(urls[0]);
    if (urls[0].match(/pic\.twitter\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*)/))
        urls[0] = "https://" + urls[0];
    let element = <div>{tweetText[0]} <a href={urls[0]} target="_blank" rel="noopener noreferrer">{urls[0]}</a>{tweetText[1]}</div>;
    return element;
};

export function displayTweets (filteredTweets, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
            { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
        ];
    } else if (sortedColumn === "retweetNb") {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date'},
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb', defaultSort: "desc" }
        ];
    } else {
        columns = [
            { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
            { title: keyword('twittersna_result_username'), field: 'screen_name'},
            { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
            { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
        ];
    }

    let csvArr = keyword("twittersna_result_date") + ',' 
                + keyword("twittersna_result_username") + ',' 
                + keyword("twittersna_result_tweet") + ',' 
                + keyword('twittersna_result_like_nb') + ',' 
                + keyword("twittersna_result_retweet_nb") + ',' 
                + keyword("elastic_url") +'\n';

    let resData = [];
    filteredTweets.forEach(tweetObj => {
        const date = new Date(tweetObj._source.datetimestamp * 1000);
        resData.push(
            {
                date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                screen_name: <a href={"https://twitter.com/" + tweetObj._source.screen_name} target="_blank" rel="noopener noreferrer">{tweetObj._source.screen_name}</a>,
                tweet: tweetObj._source.full_text,
                nbLikes: tweetObj._source.favorite_count,
                retweetNb: tweetObj._source.retweet_count,
                link: "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str
            }
        );
        csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',' +
                    tweetObj._source.screen_name + ',"' 
                    + tweetObj._source.full_text + '",' 
                    + tweetObj._source.favorite_count + ','
                    + tweetObj._source.retweet_count + ',' 
                    + "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str + '\n';
    });

    return {
        data: resData,
        columns: columns,
        csvArr: csvArr,
    };
};

export const onHeatMapClick = (data, result, setheatMapTweets, keyword) => {
    let selectedHour = data.points[0].x;
    let selectedDay = data.points[0].y;
    let filteredTweets = result.tweets.filter(function (tweetObj) {
        let date = new Date(tweetObj._source.datetimestamp * 1000);
        let day = getDayAsString(date.getDay());
        let hour = getHourAsString(date.getHours());
        return hour === selectedHour && day === selectedDay;
    });
    let res = displayTweets(filteredTweets, keyword);
    setheatMapTweets(displayTweets(filteredTweets, keyword));
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
      let date = new Date(val._source.datetimestamp * 1000);
      return `${date.getDay()}_${date.getHours()}`;
    });
  
    // Groupby day_hour
    let nbTweetArr = _.countBy(dayHourArr);
    // Convert 1D-array to 2D-array
    let nbTweetArr2D = [...Array(dayArr.length)].map(e => Array(hourArr.length).fill(0));
    Object.entries(nbTweetArr).forEach(nbTweet => {
      let day = parseInt(nbTweet[0].split("_")[0]);
      let hour = parseInt(nbTweet[0].split("_")[1]);
      nbTweetArr2D[day][hour] = nbTweet[1];
    });
    // Re-order rows according to dayArr
    let orderedNbTweetArr2D = [];
    dayArr.forEach(dayStr => {
      let dayInt = getDayAsInt(dayStr);
      orderedNbTweetArr2D.push(nbTweetArr2D[dayInt])
    });
  
    return orderedNbTweetArr2D;
  }


export function createHeatMap(request, hits, titleKey) {

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
        filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Heatmap",
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      responsive: true,
      modeBarButtons: [["toImage"], ["resetScale2d"]],
      displaylogo: false,
    }

    let layout = {
      title: {
        text: titleKey + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"],
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

  