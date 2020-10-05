import { useEffect } from "react";

const useTwitterSnaRequest = (request) => {


    useEffect(() => {

        const makeResult = (request, responseArrayOf9, givenFrom, givenUntil, final) => {
            const result = {};
            result.histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), givenFrom, givenUntil);
        
        };


    }, [JSON.stringify(request)]);


};
export default useTwitterSnaRequest;