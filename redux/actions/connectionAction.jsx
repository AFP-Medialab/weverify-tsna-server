export const connectionWindow = (state) => {
  return {
    type: "CONNECTION_WINDOWS",
    payload: state,
  };
};

export const connectionEnable = (state) => {
  return {
    type: "CONNECTION_ENABLE",
    payload: state,
  };
};
