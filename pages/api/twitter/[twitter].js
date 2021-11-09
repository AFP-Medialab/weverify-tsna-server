import TwitterApi from 'twitter-api-v2';
import { withIronSessionApiRoute } from "iron-session/next";

const TOKENS = {
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET
  };
const client = new TwitterApi({
   ...TOKENS
  });


export default withIronSessionApiRoute (
  async function twitter(req, res){
    const {
        query: { twitter },
      } = req;
    console.log("call ..... ", twitter)
    switch (twitter){
        case "twitterAuth":{
            console.log("authentication ...")
            const link = await client.generateAuthLink('http://localhost:3000/api/twitter/callback')
            var data = { authLink: link.url, authMode: 'callback' }
            console.log("link ", link)
            // session enable
            req.session.oauthToken = link.oauth_token;
            req.session.oauthSecret = link.oauth_token_secret;
            await req.session.save();
            res.json(data)
            
            return res.status(200);
        }
        case "callback":{
            console.log("call back ...")
            console.log("req ", req.query)
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
            req.session.oauth_token = token;
            await req.session.save();
            // Ask for definitive access token
            tempClient.login(verifier).then((accessToken, accessSecret, screenName, userId) => {console.log("screen name : ", screenName)});
            res.redirect('/twitterConnect')
            return;}
        case "postTweet":{
            const token = req.session.oauth_token;
            const savedSecret = req.session.oauthSecret;
            if(!token || !savedSecret){
              console.log("token does not exist");
            }
            
        }
        case "postTweetBot":{
            const client = new TwitterApi({ ...TOKENS, accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET, });
            const tweet = req.body
            //Test if it is API V1.1 or V2
            //Default is v1
            //console.log("client ", client)
            client.v1.tweet(tweet)
            .then((response) => {
                //console.log("response :",JSON.stringify(response))
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
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long"
  
})
