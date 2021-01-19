import {createSocioSemantic4ModeGraph} from "../../components/shared/TwitterSna/Hooks/socioSemGraph";

export default (req, res) =>{
    console.log("req received");
    const tweets = req.body;
    const response = createSocioSemantic4ModeGraph(tweets);
    res.json(response);
    console.log("resp sent");
    return;
}