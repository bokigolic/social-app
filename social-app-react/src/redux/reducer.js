import { DRAWER_CLOSE, DRAWER_OPEN, ROUTE_SET, ROUTE_WITH_FRAGMENT_SET } from "./actions";

const initialState = {
  routeSimple: 'HOME',
  something: 'bla bla'
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    default:
      return state;
  }
};

export default rootReducer;