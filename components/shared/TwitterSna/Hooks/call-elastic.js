let elasticSearch_url = process.env.REACT_APP_ELK_URL;


// Aggregation data for pie charts, timelime chart,...
export function getAggregationData(param) {
    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);
    let aggs = constructAggs(param);

    let query = JSON.stringify(buildQuery(aggs, must, mustNot, 0)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");

    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const elasticResponse = await response.json();
        return elasticResponse;
    };
    return userAction();
}

export async function getTweets(param) {
    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);
    let aggs = {};
    return queryTweetsFromES(aggs, must, mustNot).then(elasticResponse => {
        return {
            tweets: elasticResponse.hits.hits
        }
    });
}

//Get tweets
async function queryTweetsFromES(aggs, must, mustNot) {
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must, mustNot, 10000)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let elasticResponse = await response.json();

    let isMore10kRecords = (elasticResponse["hits"]["total"]["value"] === 10000 && elasticResponse["hits"]["total"]["relation"] === "gte") ? true : false;

    if (isMore10kRecords) {
        do {
            let tweets = elasticResponse.hits.hits;
            let searchAfter = tweets[tweets.length - 1]["sort"];

            elasticResponse = await continueQueryTweetsFromESWhenMore10k(aggs, must, mustNot, searchAfter, elasticResponse);
        } while (elasticResponse["current_hits_length"] !== 0)

        return elasticResponse;

    } else {
        return elasticResponse;
    }
}

async function continueQueryTweetsFromESWhenMore10k(aggs, must, mustNot, searchAfter, elasticResponse) {
    let arr = Array.from(elasticResponse.hits.hits);

    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuerySearchAfter(aggs, must, mustNot, 10000, searchAfter)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const newElasticResponse = await response.json();

    let id_arr = arr.map(elt => elt._id);
    Array.from(newElasticResponse.hits.hits).forEach(hit => {
        if (!id_arr.includes(hit._id)) {
            arr.push(hit);
        }
    })
    elasticResponse["current_hits_length"] = newElasticResponse.hits.hits.length;
    elasticResponse.hits.hits = arr;
    elasticResponse.hits.total.value = arr.length;
    return elasticResponse;
}

//Build a query for elastic search
function buildQuery(aggs, must, mustNot, size) {
    let query = {
        "aggs": aggs,
        "size": size,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "query": {
            "bool": {
                "must": must,
                "filter": [],
                "should": [],
                "must_not": mustNot
            }
        },
        "sort": [
            {"datetimestamp": {"order": "asc"}}
        ]
    };
    return query;
}
//Build a query for elastic search
function buildQuerySearchAfter(aggs, must, mustNot, size, searchAfter) {
    let query = {
        "aggs": aggs,
        "size": size,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "query": {
            "bool": {
                "must": must,
                "filter": [],
                "should": [],
                "must_not": mustNot
            }
        },
        "search_after": searchAfter,
        "sort": [
            {"datetimestamp": {"order": "asc"}}
        ]
    };
    return query;
}

//Construct the match phrase (filter for tweets)
function constructMatchPhrase(param, startDate, endDate) {
    if (startDate === undefined) {
        startDate = param["from"];
        endDate = param["until"];
    }
    let startDateObj = new Date(startDate);
    let startDateEpochSeconds = startDateObj.getTime()/1000;
    let endDateObj = new Date(endDate);
    let endDateEpochSeconds = endDateObj.getTime()/1000;

    let match_phrases = JSON.stringify({
            "query_string": {
                "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
                "analyze_wildcard": true,
                "time_zone": "Europe/Paris"
            }
        },
        {
            "match_all": {}
        });

    // SESSID MATCH
   /* match_phrases += ",{" +
        '"match_phrase": {' +
            '"essid": {' +
                '"query":"' + param["session"] + '"' +
                '}' +
            '}' +
        '}';*/

    // KEYWORDS ARGS MATCH
    let validUrl = require('valid-url');
    param.keywordList.forEach(arg => {
        if (arg[0] === '#') {
            match_phrases += ',{' +
                '"match_phrase": {' +
                    '"hashtags": {' +
                        '"query":"' + arg.substr(1) + '"' +
                        '}' +
                    '}' +
                '}'
        } else if (validUrl.isUri(arg)) {
            match_phrases += ',{' +
                '"match_phrase": {' +
                    '"urls": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}'
        }
        else {
            match_phrases += ',{' +
                '"match_phrase": {' +
                    '"full_text": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}';
        }
    });

    // USERNAME MATCH
    if (param["userList"] !== undefined) {
        param["userList"].forEach(user => {
            if (user !== "") {
                match_phrases += ',{' +
                    '"match_phrase": {' +
                        '"screen_name": {' +
                            '"query":"' + user + '"' +
                            '}' +
                        '}' +
                    '}';
            }
        })
    }
    // RANGE SETUP
    match_phrases += "," + JSON.stringify({
        "range": {
            "datetimestamp": {
                "format": "epoch_second",
                "gte": startDateEpochSeconds,
                "lte": endDateEpochSeconds
            }
        }
    });

    // VIDEO MATCH
    if (param.media === "video") {
        match_phrases += ',' + JSON.stringify({
            "match_phrase": {
                "media.type": {
                    "query": "video"
                }
            }
        })
    }

    // IMAGE MATCH
    if (param.media === "image") {
        match_phrases += ',' + JSON.stringify({
            "match_phrase": {
                "media.type": {
                    "query": "photo"
                }
            }
        })
    }

    // VERIFIED ACCOUNT ?


    // LANGUAGE MATCH
    if (param.lang !== "none") {
        match_phrases += ',' + JSON.stringify({
            "match_phrase": {
                "lang": {
                    "query": param.lang
                }
            }
        })
    }

    return [match_phrases]
}

//Construct the match phrase (filter for tweets)
function constructMatchNotPhrase(param) {

    if (param.bannedWords === null || param.bannedWords === undefined)
        return [];
    else {
        let match_phrases = "";
        param.bannedWords.forEach(arg => {
            if (match_phrases !== "")
            match_phrases += ",";
            if (arg[0] === '#') {
                match_phrases += '{' +
                    '"match_phrase": {' +
                        '"hashtags": {' +
                            '"query":"' + arg.substr(1) + '"' +
                            '}' +
                        '}' +
                    '}'
            } else {
                match_phrases += '{' +
                    '"match_phrase": {' +
                        '"full_text": {' +
                            '"query":"' + arg + '"' +
                            '}' +
                        '}' +
                    '}';
            }
        });
        return [match_phrases]
    }
}
//Construct the aggregations (chose what information we will have in the response)
function constructAggs(param) {

    let timelineInterval = getIntervalForTimeLineChart(param);

    let aggs = {
        "retweets": constructAggForSum("retweet_count"),
        "likes": constructAggForSum("favorite_count"),
        "tweet_count": constructAggForCount("_id"),
        "top_user": constructAggForTop("screen_name", "desc", 20, "_count", null),
        "top_user_favorite": constructAggForTop("screen_name", "desc", 20, "sum", "favorite_count"),
        "top_user_retweet": constructAggForTop("screen_name", "desc", 20, "sum", "retweet_count"),
        "top_user_mentions": constructAggForTop("user_mentions.screen_name", "desc", 20, "_count", null),
        "top_url_keyword": constructAggForTop("urls", "desc", 25, "_count", null),
        "date_histo" : constructAggForTimeLineChart(timelineInterval)
    }
    return aggs;
}
function constructAggForSum(field) {
    let agg = {
        "sum": {
            "field": field
        }
    }
    return agg;
}

function constructAggForCount(field) {
    let agg = {
        "value_count": {
            "field": field
        }
    }
    return agg;
}

function constructAggForTop(field, order, size, typeAgg, fieldAgg) {
    let agg = {}

    if (typeAgg === "sum") {
        agg = {
            "terms": {
                "field": field + ".keyword",
                "order": {
                    "_1": order
                },
                "size": size
            },
            "aggs": {
                "_1": {
                    "sum": {
                        "field": fieldAgg
                    }
                }
            }
        }
    } else if (typeAgg === "_count") {
        agg = {
            "terms": {
                "field": field + ".keyword",
                "order": {
                    "_count": order
                },
                "size": size
            }
        }
    }
    return agg;
}

function constructAggForTimeLineChart(calendar_interval) {
    let agg = {
        "date_histogram": {
            "field": "datetimestamp",
            "calendar_interval": calendar_interval,
            "time_zone": "Europe/Paris",
            "min_doc_count": 1
        },
        "aggs": {
            "1": {
                "sum": {
                    "field": "retweet_count"
                }
            },
            "3": {
                "terms": {
                    "field": "screen_name.keyword",
                    "order": {
                        "rt": "desc"
                    }
                },
                "aggs": {
                    "rt": {
                        "sum": {
                            "field": "retweet_count"
                        }
                    },
                    "dt": {
                        "terms": {
                            "field": "datetimestamp"
                        }
                    }
                }
            }
        }
    }
    return agg;
}

function getIntervalForTimeLineChart(param) {
    let queryStart = param["from"];
    let queryEnd = param["until"];

    let dateEndQuery = new Date(queryEnd);
    let dateStartQuery = new Date(queryStart);

    let diff = (dateEndQuery - dateStartQuery) / (1000 * 3600 * 24);
    let interval = "";
    if (diff > 7) {
        interval = "1d";
    } else {
        interval = "1h";
    }
    return interval;
}