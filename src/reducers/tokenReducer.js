import { tokenActionTypes } from '../actions/tokenAction';
import { TOKENS } from '../config/tokens';

const initialState = {
  tokens: TOKENS,
};

export default function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case tokenActionTypes.SET_TOKENS: {
      return {
        ...state,
        tokens: action.payload
      }
    }
    default:
      return state;
  }
}
