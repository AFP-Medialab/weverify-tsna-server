import _ from "lodash";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { decodeJWTToken } from "../components/shared/AuthenticationCard/userAuthenticationUtils";
import { userLoginAction, userLoginLoadingAction } from "../redux/actions/authentificationActions";
import { redirectFromPlugin} from "../redux/actions/tools/twitterSnaActions";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage"
import { authUserLoggedIn } from "../redux/slices/authentificationSlice";
//Redirect page for SSO connection from WeverifyPlugin
//TODO error management in case of URL manupilation
const sna = { tsv: "/components/NavItems/tools/TwitterSna.tsv"};

const PluginRedirect = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    useLoadLanguage(sna.tsv)
    const { query } = router;
    if(!_.isEmpty(query)){
        const {data, token, refreshToken, user} = query;
        const loadData = decodeURIComponent(data);
        const request =  JSON.parse(loadData);
        dispatch(redirectFromPlugin(request));
        //token
        const userData = decodeURIComponent(user);
        const userInfo = JSON.parse(userData);
        const currentUser = useSelector((state) => state.user)
        try {
            //console.log(userData);
            //console.log(token);
            const tokenContent = decodeJWTToken(token);
            //console.log("token create " + JSON.stringify(tokenContent));         
            dispatch(authUserLoggedIn(token, tokenContent.accessTokenExpiry, refreshToken, userInfo));
        }
        catch (jwtError) {
            //console.log("error token");
            dispatch(authUserLoginLoading(false));
        }
    }
    useEffect(() => {
        // Always do navigations after the first render
        router.push('/twitterSna', undefined, { shallow: true })
      },[]);
      return (<div>redirect</div>);      
};

export default PluginRedirect;