import {HYDRATE} from 'next-redux-wrapper';
const languageReducer = (state = "en", action) => {
    switch (action.type) {
        case HYDRATE:
            return {...state, ...action.payload};
        case "CHANGE":
            return action.payload;
        default:
            return state;
    }
};
export default languageReducer;