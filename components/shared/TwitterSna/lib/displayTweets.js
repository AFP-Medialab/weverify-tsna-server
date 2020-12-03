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

export function removeUnusedFields(tweets, fields){
    let newTweets = tweets.map((tweet) => {
      let tweetObj = JSON.parse(JSON.stringify(tweet));
        delete tweetObj._index;
        delete tweetObj._type;
        delete tweetObj._id;
        delete tweetObj._score;
        fields.map((field) =>{
          if (tweetObj._source[field] !== undefined && tweetObj._source[field] !== null) {
            delete tweetObj._source[field];        
          }
        });
        return tweetObj;
    });
    return newTweets;
  }