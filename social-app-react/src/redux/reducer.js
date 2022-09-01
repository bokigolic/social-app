import { DRAWER_CLOSE, DRAWER_OPEN, ROUTE_SET, ROUTE_WITH_FRAGMENT_SET } from "./actions";

const initialState = {
  myUserData: null,
  routeSimple: 'HOME',
  something: 'bla bla'
};

const rootReducer = (state = initialState, action) => {
  const payload = action.payload;
  switch (action.type) {

    case 'LOGIN_FETCHED':
      return {
        ...state,
        myUserData: payload
      };

    case 'LOGOUT':
      return {
        ...state,
        myUserData: null
      };



    default:
      return state;
  }
};

export default rootReducer;