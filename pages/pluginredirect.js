import { useRouter } from 'next/router';
import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { redirectFromPlugin } from "../redux/actions/tools/twitterSnaActions";
import { userLoginAction, userLoginLoadingAction } from "../redux/actions/authentificationActions";
import { decodeJWTToken } from "../components/shared/AuthenticationCard/userAuthenticationUtils";
import _ from "lodash";

//Redirect page for SSO connection from WeverifyPlugin
//TODO error management in case of URL manupilation

const PluginRedirect = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { query } = router;
    if(!_.isEmpty(query)){
        const {data, token, refreshToken, user} = query;
        const loadData = decodeURIComponent(data);
        const request =  JSON.parse(loadData);
        dispatch(redirectFromPlugin(request));
        //token
        const userData = decodeURIComponent(user);
        const userInfo = JSON.parse(userData);
        try {
            //console.log(userData);
            //console.log(token);
            const tokenContent = decodeJWTToken(token);
            //console.log("token create " + JSON.stringify(tokenContent));         
            dispatch(userLoginAction(token, tokenContent.accessTokenExpiry, refreshToken, userInfo));
        }
        catch (jwtError) {
            console.log("error token");
            dispatch(userLoginLoadingAction(false));
        }
    }
    useEffect(() => {
        // Always do navigations after the first render
        router.push('/', undefined, { shallow: true })
      },[]);
      return (<div>redirect</div>);      
};

export default PluginRedirect;