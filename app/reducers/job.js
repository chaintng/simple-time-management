const initialState = {
  mode: 'ADD',
  isLoadingJobs: true,
  jobs: [],
  jobFormValue: {
    note: ''
  }
};

export default function job(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'BEGIN_LOAD_ALL_JOBS':
      return Object.assign({}, state, {
        isLoadingJobs: true
      });
    case 'CHANGE_MODE':
      return Object.assign({}, state, {
        mode: action.mode,
        jobFormValue: Object.assign({}, state.jobFormValue, action.jobFormValue)
      });
    case 'FINISH_LOAD_ALL_JOBS':
      return Object.assign({}, state, {
        mode: initialState.mode,
        isLoadingJobs: false,
        jobs: action.jobs,
        jobFormValue: initialState.jobFormValue
      });
    default:
      return state;
  }
}
