import { HYDRATE } from "next-redux-wrapper";
const dictionaryReducer = (state = {}, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case "SET":
      return action.payload;
    case "ADD":
      return { ...state, [action.payload.label]: action.payload.json };
    default:
      return state;
  }
};
export default dictionaryReducer;
