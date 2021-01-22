let wrapperURL = process.env.REACT_APP_AUTH_BASE_URL;

export default (req, res) => {
  const {
    query: { essid },
  } = req;
  const url = wrapperURL + "/status/" + essid;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": req.headers.authorization,
  };
  
  const userAction = async (res, headers) => {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const status = response.status;
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(status);
    }
  };
  return userAction(res, headers);
};
