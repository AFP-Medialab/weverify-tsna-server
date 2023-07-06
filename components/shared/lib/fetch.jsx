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

export async function userPostAction(res, url, body, headers, type = "json") {
  console.log(url);
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });
  const status = response.status;

  if (response.ok) {
    if (status === 200) {
      if ((type == "text")) {
        const data = await response.text();
        res.send(data);
      } else {
        //default value is json
        const data = await response.json();
        res.json(data);
      }
    } else {
      res.status(status).json(defaultBody);
    }
  } else {
    res.status(status).json(defaultBody);
  }
}
