import TwitterApi from 'twitter-api-v2';
import { withIronSessionApiRoute } from "iron-session/next";

const TOKENS = {
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET
  };
const client = new TwitterApi({
   ...TOKENS
  });
const callbackUrl = process.env.TWITTER_CALL_BACK_URL
const  twitterAuth = async (req)  => {
  console.log("authentication ...")
  const link = await client.generateAuthLink(callbackUrl)
  var data = { authLink: link.url, authMode: 'callback' }
  console.log("link ", link)
  // session enable
  req.session.oauthToken = link.oauth_token;
  req.session.oauthSecret = link.oauth_token_secret;
  await req.session.save();
  return data;
}

export default withIronSessionApiRoute (

  async function twitter(req, res){
    const {
        query: { twitter },
      } = req;
    console.log("call ..... ", twitter)
    switch (twitter){
        case "twitterAuth":{
            console.log("authentication ...")
            const link = await client.generateAuthLink(callbackUrl)
            var data = { authLink: link.url, authMode: 'callback' }
           // console.log("link ", link)
            // session enable
            req.session.oauthToken = link.oauth_token;
            req.session.oauthSecret = link.oauth_token_secret;
            await req.session.save();
            res.status(301).json(data)
            return ;
        }
        case "callback":{
            //console.log("call back ...")
            //console.log("req ", req.query)
            if (!req.query.oauth_token || !req.query.oauth_verifier) {
                res.status(400).render('error', { error: 'Bad request, or you denied application access. Please renew your request.' });
                return;
              }
            const token = req.query.oauth_token;
            const verifier = req.query.oauth_verifier;
            const savedToken = req.session.oauthToken;
            const savedSecret = req.session.oauthSecret;
            
            if (!savedToken || !savedSecret || savedToken !== token) {
              res.status(400).render('error', { error: 'OAuth token is not known or invalid. Your request may have expire. Please renew the auth process.' });
              return;
            }
          
            // Build a temporary client to get access token
            const tempClient = new TwitterApi({ ...TOKENS, accessToken: token, accessSecret: savedSecret });
            // Ask for definitive access token
            const accessToken =  await tempClient.login(verifier)
            req.session.accessToken = accessToken.accessToken
            req.session.accessSecret = accessToken.accessSecret
            await req.session.save();
            res.redirect('/twitterConnect')
            return;}
        case "postTweet":{
            const accessToken = req.session.accessToken;
            const accessSecret = req.session.accessSecret;
            //console.log("tokens ... ", req.session)
            if(!accessToken || !accessSecret){
              console.log("token does not exist");
              //connect
              res.redirect('/api/twitter/twitterAuth')
              return;
            }
            const client = new TwitterApi({ ...TOKENS, accessToken: accessToken, accessSecret: accessSecret });
            const tweet = req.body
            try {
              const response = await client.v1.tweet(tweet)
              console.log("response ", response)
              res.json(response)
              return;
            } 
            catch(err){
              console.log("Invalid verifier or access tokens! ", err);
              if(err.code === 401)
                res.redirect('/api/twitter/twitterAuth')
            }
          
        }
        case "postTweetBot":{
            const client = new TwitterApi({ ...TOKENS, accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET, });
            const tweet = req.body           
            client.v1.tweet(tweet)
            .then((response) => {

                res.status(200)
                res.json(response)
                })
            .catch((err) => {
              console.log("error ", err); res.status(err.code).send('Invalid verifier or access tokens!')});
              return;
            }
        default:
          {res.status(404).json({ error: 'not exist' });}  

    }
    
},
  {
    cookieName: "weverify_bot_cookie",
    password: "complex_password_at_least_32_characters_long_weverify"
  
})
