import React, { useEffect } from "react";
import { create } from "jss";
import rtl from "jss-rtl";
import { useSelector } from "react-redux";
import {
  createTheme,
  ThemeProvider,
  StylesProvider,
  jssPreset,
} from "@material-ui/core/styles";

const RTLWrapper = (props) => {
  const currentLang = useSelector((state) => state.language);

  // Set UI direction based on language reading direction
  const direction = currentLang !== "ar" ? "ltr" : "rtl";

  const isRtl = (direction === "rtl");

  // Configure JSS
  const jss = create({ plugins: [...jssPreset().plugins, rtl({enabled: isRtl})] });

  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  const theme = createTheme({
    direction: direction,
  });

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StylesProvider>
  );
};

export default RTLWrapper;
