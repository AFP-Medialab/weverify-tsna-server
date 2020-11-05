import { useRouter } from 'next/router';
import { useEffect } from 'react'

//Redirect page for SSO connection from WeverifyPlugin
const PluginRedirect = () => {
    const router = useRouter();
    console.log(router.query);

    useEffect(() => {
        // Always do navigations after the first render
        router.push('/', undefined, { shallow: true })
      },[]);
      return (<div>redirect</div>);      
};

export default PluginRedirect;