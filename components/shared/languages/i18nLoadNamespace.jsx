import { useTranslation } from "react-i18next";
import { namespace } from "stylis";

export const i18nLoadNamespace = (namespace) => {
  const { t } = useTranslation(namespace);
  return t;
};

export const i18nLoadNamespaceNoSuspense = (namespace) => {
  const { t, ready } = useTranslation(namespace, {useSuspense: false});
  return { t, ready };
};
