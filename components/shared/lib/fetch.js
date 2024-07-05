import _ from "lodash";
const defaultBody = "";

export async function userGexfAction(res, url, body) {
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const status = response.status;
  
  if (response.ok) {
    const data = await response.json();
    if (!_.isUndefined(data.gexfStatus)) data.gexfStatus.esParams = null;
    res.json(data);
  } else {
    res.status(status).json(defaultBody);
  }
}

export async function userPostAction(res, url, body, headers, type="json") {
  


  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });
  const status = response.status;

  if (response.ok) {
    if(status === 200){
      if(type="text"){
        const data = await response.text();
        res.send(data);
      }
      else{
        //default value is json
        const data = await response.json();
        res.json(data);
      }
    }else{
      res.status(status).json(defaultBody);
    }
  } else {
    res.status(status).json(defaultBody);
  }
}

export async function userAnalyticsAction (res, url, body, headers) {

  
  let newBody = JSON.parse(body);
  console.log(newBody);


  const url_params = new URLSearchParams();

  url_params.append("idsite", newBody.matomoSite);
  url_params.append("url", newBody.url);
  url_params.append("rec", 1);
  url_params.append("apiv", 1);
  
  url_params.append("cookie", 1);

  url_params.append("action_name", newBody.actionName);

  console.log(url_params);

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: url_params,
  });

  const status = response.status;
  if(response.ok) {
    if(status === 200) {
      const data = await response.json();
      res.json(data);
    }else{
      res.status(status).json(defaultBody);
    }
  } else {
    res.status(status).json(defaultBody);
  }
  
    
}
