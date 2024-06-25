import { useTranslation } from "react-i18next";
import { namespace } from "stylis";

/**
   *
   *
   * @param String namespace
   */
export const i18nLoadNamespace = (namespace) => {
  const { t } = useTranslation(namespace);
  return t;
};


/**
   * for the files that need it, useSuspense is set to false and ready boolean is used to set the value of keyword, otherwise keywords don't load properly.
   *
   * @param String namespace
   */

export const i18nLoadNamespaceNoSuspense = (namespace) => {
  const { t, ready } = useTranslation(namespace, {useSuspense: false});
  return { t, ready };
};
