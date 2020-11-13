import {
    createWordCloud
} from "../../components/shared/TwitterSna/Hooks/cloudChart";

export default (req, res) =>{
    //console.log(req.body.tweets);
    console.log("build cloudwords");
    res.json(createWordCloud(req.body.tweets, req.body.request));
    console.log("end cloudwords");
    return;
}