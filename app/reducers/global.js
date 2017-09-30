const initialState = {
  preferredWorkingHour: null,
};

export default function global(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    default:
      return state;
  }
}
