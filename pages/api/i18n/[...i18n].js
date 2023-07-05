let i18nURL = process.env.REACT_APP_I18N_CONTENT;

export default (req, res) => {
  const {
    query: { i18n },
  } = req;
  const path = i18n.join("/");
  const url = i18nURL + "/" + path;
  const headers = {
    "Content-Type": "text/plain",
  };

  const getContent = async (res, headers) => {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const status = response.status;
    if (response.ok) {
      const data = await response.text();
      res.send(data);
    } else {
      res.status(status);
    }
  };
  return getContent(res, headers);
};
