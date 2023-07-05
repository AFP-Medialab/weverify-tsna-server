import { SNA_SET_TYPE } from "../../actions/types/snaCommunTypes";
import { CT_SNA_CLEAN } from "../../actions/types/crowdTangleSnaTypes";

const defaultState = {
    type : null,
    tsv: null,
    tsvInfo: null
}

const snaTypeReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
    case SNA_SET_TYPE:
      return {
        ...state,
        type : payload.type,
        tsv : payload.tsv,
        tsvInfo : payload.tsvInfo
    };
    case CT_SNA_CLEAN:
        return (state = defaultState);
    default:
        return state;
    }
}

export default snaTypeReducer