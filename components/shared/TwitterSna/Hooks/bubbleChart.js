function getColorOfMostActiveUserBubble(value) {
    switch (true) {
        case (value < 5):
            // return "#5da4d6";
            return "#2f7fb8";
        case (value < 15):
            return "#ff900e";
        default:
            return "#ff3636";
    }
}

export const onBubbleChartClick = (data) => {
    let selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
    let filteredTweets = result.tweets.filter(function (tweetObj) {
        return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
    });
    setBubbleTweets(displayTweets(filteredTweets));

}

export function createBubbleChartOfMostActiveUsers(userProfile, request) {
    let tweetCountObj = _.countBy(result.tweets.map((tweet) => {return tweet._source.screen_name.toLowerCase(); }));
    let nbDays = Math.floor(( Date.parse(request['until']) - Date.parse(request['from']) ) / 86400000);
    nbDays = nbDays > 1 ? nbDays : 1;
    let objArr = userProfile.map((obj) => {
        return {
            screen_name: obj._source.screen_name,
            followers_count: obj._source.followers_count,
            datetimestamp: obj._source.datetimestamp,
            indexedat: obj._source.indexedat,
            verified: obj._source.verified
        }; 
    });

    let groupByUserArr = objArr.reduce((r, a) => {
        r[a.screen_name] = [...r[a.screen_name] || [], a];
        return r;
       }, {});
    let closestDateObjArr = Object.entries(groupByUserArr).map((row) => { 
        let filteredUndef = row[1].filter(obj => obj.indexedat !== undefined);
        filteredUndef.map((obj) => {
            obj.distanceDateTime = Math.abs((Date.parse(request['until']) / 1000) - obj.indexedat);
            return obj;
        });
        return _.orderBy(filteredUndef, ['distanceDateTime'], ['asc'])[0];
     })

    let sortedObjArr = _.orderBy(closestDateObjArr, ['datetimestamp', 'screen_name'], ['asc', 'asc']);

    let x = [];
    let y = [];
    let text = [];
    let color = []
    let size = [];
    let symbol = [];

    sortedObjArr.forEach((obj) => {
        let date = new Date(obj.datetimestamp * 1000);
        let dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let nbTweets = tweetCountObj[obj.screen_name.toLowerCase()];
        let avgTweetsPerDate = nbTweets/nbDays;

        x.push(dateStr);
        y.push(obj.followers_count);
        text.push('@' + obj.screen_name + '<br>Posted <b>' + nbTweets + '</b> tweets in ' + nbDays + ' days');
        color.push(getColorOfMostActiveUserBubble(avgTweetsPerDate));
        size.push(nbTweets);
        symbol.push( (obj.verified ? "diamond" : "circle") );
    });

    let data = [
        { 
            mode: "markers",
            x: x, 
            y: y, 
            text: text,
            hovertemplate: '%{text}<br>Account created: %{x}<br>Followers: %{y}<br>',
            marker: { 
                color: color,
                size: size,
                sizeref: (Math.max(...size) < 10 ? 1 : 2 * Math.max(...size) / (60**2)),
                sizemode: 'area',
                sizemin: 5,
                symbol: symbol
            },
            name: ""
        } 
    ]

    let layout = {
        title: {
            text: keyword("bubble_chart_title") + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"],
            font: {
                family: 'Arial, sans-serif',
                size: 18
            },
            xanchor: 'center'
        },
        xaxis: {
            title: keyword("twittersna_acd"),
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#C0C0C0'
            },
        },
        yaxis: {
            title: keyword("twittersna_nb_followers"),
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#C0C0C0'
            },
            range:[0, Math.max(...y) + 10],
            rangemode: 'tozero'
        }
    }

    let config = {
        displayModeBar: true,
        toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Bubble",
          },
        modeBarButtons: [
            ["toImage"], 
            ["zoom2d"],
            ["pan2d"],
            ["resetScale2d"],
            ['drawline'],
            ['drawopenpath'],
            ['drawclosedpath'],
            ['drawcircle'],
            ['drawrect'],
            ['eraseshape']
        ],
        displaylogo: false,
    }

    return {
        data: data,
        layout: layout,
        config: config
    }
}