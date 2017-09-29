const initialState = {
  isLoadingJobs: true,
  jobs: [],
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
    case 'FINISH_LOAD_ALL_JOBS':
      return Object.assign({}, state, {
        isLoadingJobs: false,
        jobs: action.jobs
      });
    default:
      return state;
  }
}
