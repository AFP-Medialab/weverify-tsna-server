import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPBackend from "i18next-http-backend";
import ChainedBackend from "i18next-chained-backend";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
//import resourcesToBackend from "i18next-resources-to-backend";
console.log("echo ", publicRuntimeConfig.translateUrl)
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(ChainedBackend)
  .init({
    //debug: true,
    ns: ["components/NavBar"],
    defaultNS: "components/NavBar",
    fallbackLng: "en",
    saveMissing: true,
    interpolation: {
      escapeValue: false,
    },
    load: "languageOnly",
    backend: {
      backends: [
        HTTPBackend,
        //resourcesToBackend((lng, ns) => import(`./LocaLDictionary/locales/${lng}/${ns}.json`))
        HTTPBackend,
      ],

      backendOptions: [
        {
          loadPath: `${publicRuntimeConfig.translateUrl}/dictionaries/{{ns}}.tsv?lang={{lng}}&tag=${publicRuntimeConfig.translateTag}`,
          crossDomain: true,
          requestOptions: {
            // used for fetch, can also be a function (payload) => ({ method: 'GET' })
            mode: "cors",
            credentials: "same-origin",
          },
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });