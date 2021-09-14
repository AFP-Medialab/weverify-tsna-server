

import {getEpochMillis } from "./timeline";
import {getJsonDataForTimeLineChartFb,getJsonDataForTimeLineChartInsta } from "./timeline"
import{new_date} from './heatMap'

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
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
export function createBubbleChartOfMostActiveUsers(props, keyword) {
    //console.log("BUBBLEEE ", props.data)

    var tweetCountObj=null;
    var getDataResult=null;
    var nbDays=null;
    var objArr=null;

   
    if(props.data[0].facebook_id) {
        //console.log("YES")
       
        tweetCountObj = _.countBy(props.data.map((tweet) => {
            
            if (isNumeric(tweet.page_name)===false) {
                //console.log("isNumeric(n) ",isNumeric(tweet.page_name))
                return tweet.page_name.toLowerCase();           
            }
            else{
                return tweet.page_name.toString().toLowerCase();                
            }
             }));
      //  console.log("tweetCountObj ",tweetCountObj)
        
        getDataResult = getJsonDataForTimeLineChartFb(props.data)
       // console.log("getDataResultFB ",getDataResult)
    
        nbDays = Math.floor(( getEpochMillis(getDataResult[2]) - getEpochMillis(getDataResult[1]) ) / 86400000);
      //  console.log("nbDays ",nbDays)
        nbDays = nbDays > 1 ? nbDays : 1;
        objArr = props.data.map((obj) => {
            return {
                screen_name: obj.page_name,
                followers_count: obj.likes_at_posting,
                //datetimestamp: getEpochMillis(obj.created),
                post_created: obj.post_created
                
                }; 
        });
      //  console.log("objArr ",objArr)   

    }
    else{
      //  console.log("FALSEEE")
        tweetCountObj = _.countBy(props.data.map((tweet) => {
            
            if (isNumeric(tweet.user_name)===false) {
                //console.log("isNumeric(n) ",isNumeric(tweet.user_name))
                return tweet.user_name.toLowerCase();           
            }
            else{
                return tweet.user_name.toString().toLowerCase();                
            }
            //return tweet.user_name.toLowerCase(); 
        
        
        }));
      //  console.log("tweetCountObj ",tweetCountObj)
        
        getDataResult = getJsonDataForTimeLineChartInsta(props.data)
     //   console.log("getJsonDataForTimeLineChartInsta ",getJsonDataForTimeLineChartInsta)

        nbDays = Math.floor(( getEpochMillis(getDataResult[2]) - getEpochMillis(getDataResult[1]) ) / 86400000);
      //  console.log("nbDays ",nbDays)
        nbDays = nbDays > 1 ? nbDays : 1;
        objArr = props.data.map((obj) => {
            return {
                screen_name: obj.user_name,
                followers_count: obj.followers_at_posting,
                //datetimestamp: getEpochMillis(obj.created),
                post_created: obj.post_created
                
                }; 
        });
       // console.log("objArr ",objArr)   

    }

//////////////////////////////////////////////////////////////////////
/*
    let tweetCountObj = _.countBy(props.data.map((tweet) => {return tweet.user_name.toLowerCase(); }));
    console.log("tweetCountObj ",tweetCountObj)
    
    let getDataResult = getJsonDataForTimeLineChartInsta(props.data)

    let nbDays = Math.floor(( getEpochMillis(getDataResult[2]) - getEpochMillis(getDataResult[1]) ) / 86400000);
    console.log("nbDays ",nbDays)
    nbDays = nbDays > 1 ? nbDays : 1;
    let objArr = props.data.map((obj) => {
        return {
            screen_name: obj.user_name,
            followers_count: obj.followers_at_posting,
            //datetimestamp: getEpochMillis(obj.created),
            created: obj.created
            
            }; 
    });
    console.log("objArr ",objArr)
*/
//////////////////////////////////////////////////////////////////////
    let groupByUserArr = objArr.reduce((r, a) => {
        r[a.screen_name] = [...r[a.screen_name] || [], a];
        return r;
       }, {});

    let closestDateObjArr = Object.entries(groupByUserArr).map((row) => { 
        let filteredUndef = row[1];
        filteredUndef.map((obj) => {
            return obj;
        });
        return filteredUndef[0];
        
     })


    let sortedObjArr = _.orderBy(closestDateObjArr, ['post_created', 'screen_name'], ['asc', 'asc']);
    let x = [];
    let y = [];
    let text = [];
    let color = []
    let size = [];
    let symbol = [];
    
    /*var new_date = function(dateStr) {
  
        //var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s(\w+)\s*$/
        var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CEST\s*$/
          , m = (""+dateStr).match(r);
        return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
      };
      */
    sortedObjArr.forEach((obj) => {
      //  let date1 = new Date(obj.datetimestamp * 1000);
        let date = new Date(new_date(obj.post_created));
       // console.log("date ", date)
      
        let dateStr= date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()+ " " + date.getHours();
       // console.log("dateStr1 ", dateStr1)

       // let dateStr1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        //console.log("dateStr ", dateStr)

        var nbTweets;
        if (isNumeric(obj.screen_name)===false) {
            nbTweets = tweetCountObj[obj.screen_name.toLowerCase()];
            //console.log("YES11")
        }
        else{
            nbTweets = tweetCountObj[obj.screen_name.toString().toLowerCase()];
           // console.log("NO11")

        } 
       // let nbTweets = tweetCountObj[obj.screen_name.toLowerCase()];
      //  console.log("nbTweets ", nbTweets)

        let avgTweetsPerDate = nbTweets/nbDays;
        //console.log("avgTweetsPerDate ", avgTweetsPerDate)

        x.push(dateStr);
      //  console.log("x ", x)

        y.push(obj.followers_count);
      //  console.log("y ", y)

        text.push('@' + obj.screen_name + '<br>Posted <b>' + nbTweets + '</b> posts in ' + nbDays + ' days');
        //console.log("text ", text)

        color.push(getColorOfMostActiveUserBubble(avgTweetsPerDate));
     //   console.log("color ", color)

        size.push(nbTweets);
     //   console.log("size ", size)

        symbol.push( (obj.verified ? "diamond" : "circle") );
      //  console.log("symbol ", symbol)

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
            text: keyword("bubble_chart_title") + "<br>"+ getDataResult[1] + " - " +getDataResult[2],
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
        annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 1,
            y: -0.180,
            text: 'weverify.eu',
            showarrow: false
            },
        ],
        yaxis: {
            title: keyword("twittersna_nb_followers"),
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#C0C0C0'
            },
            range:[0, Math.max(...y) + 0.1 * Math.max(...y)],
            rangemode: 'tozero'
        }
        
    }

    let config = {
        displayModeBar: true,
        toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: "CSV" + "_Bubble Chart",
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