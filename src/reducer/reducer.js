const initState = {
  user: null,
  slates: {},
};

const appReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FORECLOSURE_LISTINGS':
      return { ...state, foreclosureListings: action.payload };
    case 'ADD_SLATE':
      return { ...state, slates: { ...state.slates, [action.payload.title]: action.payload } };
    case 'REMOVE_SLATE':
      delete state.slates[action.payload];
      return { ...state, slates: { ...state.slates } };
    default:
      return state;
  }
};

export default appReducer;
