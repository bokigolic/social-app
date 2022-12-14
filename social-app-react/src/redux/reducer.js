import { DRAWER_CLOSE, DRAWER_OPEN, ROUTE_SET, ROUTE_WITH_FRAGMENT_SET } from "./actions";

const initialState = {
  myUserData: null,
  posts: [],
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

    case 'POSTS_FETCHED':
      return{
        ...state,
        posts: payload
      };



    default:
      return state;
  }
};

export default rootReducer;