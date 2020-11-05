import { useRouter } from 'next/router';
import { useEffect } from 'react'
import { format } from 'url'
import { useDispatch } from "react-redux";
import {redirectFromPlugin} from "../redux/actions/tools/twitterSnaActions";
import _ from "lodash";

//Redirect page for SSO connection from WeverifyPlugin



const PluginRedirect = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { query } = router;
    if(!_.isEmpty(query)){
    const {data, token} = query;
    const loadData = decodeURIComponent(data);
    console.log(loadData);
    const request =  JSON.parse(loadData);
    dispatch(redirectFromPlugin(request));
    console.log(token);
    }
    useEffect(() => {
        // Always do navigations after the first render
        //router.push('/', undefined, { shallow: true })
      },[]);
      return (<div>redirect</div>);      
};

export default PluginRedirect;