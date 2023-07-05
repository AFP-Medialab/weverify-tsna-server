const defaultState = {
    connectionEnable: false,
    windowsOpen: false
}
const connectionReducer = (state = defaultState, action) =>{
    switch (action.type) {
        case 'CONNECTION_WINDOWS':
            return {...state, windowsOpen: action.payload}
        case 'CONNECTION_ENABLE':
            return {...state, connectionEnable: action.payload}
        default:
            return state;
    }
}

export default connectionReducer;