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

export function displayPosts (filteredTweets, keyword, sortedColumn) {
    let columns = [];
    if (sortedColumn === "nbLikes") {
        columns = [
            { title: 'twittersna_result_date', field: 'date'},
            { title: 'twittersna_result_username', field: 'screen_name'},
            { title: 'twittersna_result_tweet', field: 'tweet', render: getTweetWithClickableLink },
            { title: 'twittersna_result_like_nb', field: "nbLikes", defaultSort: "desc" },
            { title: 'twittersna_result_retweet_nb', field: 'retweetNb'}
        ];
    } else if (sortedColumn === "retweetNb") {
        columns = [
            { title: 'twittersna_result_date', field: 'date'},
            { title: 'twittersna_result_username', field: 'screen_name'},
            { title: 'twittersna_result_tweet', field: 'tweet', render: getTweetWithClickableLink },
            { title: 'twittersna_result_like_nb', field: "nbLikes"},
            { title: 'twittersna_result_retweet_nb', field: 'retweetNb', defaultSort: "desc" }
        ];
    } else {
        columns = [
            { title: 'twittersna_result_date', field: 'date', defaultSort: "asc" },
            { title: 'twittersna_result_username', field: 'screen_name'},
            { title: 'twittersna_result_tweet', field: 'tweet', render: getTweetWithClickableLink },
            { title: 'twittersna_result_like_nb', field: "nbLikes"},
            { title: 'twittersna_result_retweet_nb', field: 'retweetNb'}
        ];
    }

    let csvArr = "twittersna_result_date" + ',' 
                + "twittersna_result_username" + ',' 
                + "twittersna_result_tweet" + ',' 
                + 'twittersna_result_like_nb' + ',' 
                + "twittersna_result_retweet_nb" + ',' 
                + "elastic_url" +'\n';

    let resData = [];
    let index = 0;
    filteredTweets.forEach(tweetObj => {
        const date = new Date(tweetObj._source.datetimestamp * 1000);
        resData.push(
            {
                id : index ++,
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

  export function lowercaseFieldInTweets(tweets, field = 'hashtags') {
    let newTweets = tweets.map((tweet) => {
      let tweetObj = JSON.parse(JSON.stringify(tweet));
      if (tweetObj._source[field] !== undefined && tweetObj._source[field] !== null) {
        if (Array.isArray(tweetObj._source[field])) {
          let newArr = tweetObj._source[field].map((element) => {
            if(field === "user_mentions") {
              element.screen_name = element.screen_name.toLowerCase();
              element.name = element.name.toLowerCase();
              return element;
            } else {
              return element.toLowerCase();
            }
          });
          tweetObj._source[field] = [...new Set(newArr)];
        } else {
          tweetObj._source[field] = tweetObj._source[field].toLowerCase();
        }
      }
      return tweetObj;
    });
    return newTweets;
}
export function getDomain(url) {
  var domain;

  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  
  if (domain.indexOf("www.") > -1) { 
    domain = domain.split('www.')[1];
  }
  
  domain = domain.split(':')[0];
  domain = domain.split('?')[0];

  return domain;
}