export const setUserAction = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export const setForeclosureListingsAction = (foreclosureListings) => ({
  type: 'SET_FORECLOSURE_LISTINGS',
  payload: foreclosureListings,
});

export const addSlateAction = (slate) => ({
  type: 'ADD_SLATE', payload: slate,
});

export const removeSlateAction = (title) => ({
  type: 'REMOVE_SLATE',
  payload: title,
});
