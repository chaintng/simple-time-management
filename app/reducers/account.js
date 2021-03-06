export const initialState = {
  userForm: {
    id: '',
    email: '',
    name: '',
    gender: '',
    preferred_working_hour: '',
    role: '',
    password: '',
    confirm: '',
  },
};

export default function global(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'CHANGE_USER_FORM':
      return Object.assign({}, state, {
        userForm: action.user,
      });
    default:
      return state;
  }
}
