import {countingWordsFB} from "./countingWord"
import { useDispatch, useSelector } from "react-redux";
import {
    setCountResultFb,
} from "../../../../redux/actions/tools/twitterSnaActions"



const useFacebookResult = (data) => {
    
    const dispatch = useDispatch();

    const buildCountFb = async (responseAggs) => {
        let tot_interactions = 0;
        let tot_comments = 0;
        let tot_shares = 0;
        let tot_likes = 0;
    
        for (let index in data) {
          if (typeof data[index].total_interactions === 'string')
          {
            tot_interactions += parseInt(data[index].total_interactions.replace(/,/g, ''));
          }
          else{
            tot_interactions += data[index].total_interactions;
          }
          tot_comments += data[index].comments;
          tot_shares += data[index].shares;
          tot_likes += data[index].likes;
        }
        
        const fbCount = {};
        fbCount.count = data.length;
        fbCount.total_interactions = tot_interactions;
        fbCount.likes = tot_likes;
        fbCount.comments = tot_comments;
        fbCount.shares = tot_shares;
        useDispatch(setCountResult(fbCount));
    };

    const buildFirstFbResult = (data) => {
        //buildHistogram(request, responseAggs);
        buildCountFb(responseAggs);
        //buildPieCharts(request, responseAggs);
        //buildUrls(responseAggs);
    }
    
    buildFirstFbResult(data);

  };
  export default useFacebookResult;


