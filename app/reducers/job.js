export const initialState = {
  mode: 'ADD',
  exportDisplay: false,
  isLoadingJobs: true,
  jobs: [],
  jobFormValue: {
    title: '',
    note: '',
    hour: '',
    date: ''
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
        exportDisplay: action.exportDisplay,
        isLoadingJobs: false,
        jobs: action.jobs,
        jobFormValue: initialState.jobFormValue
      });
    default:
      return state;
  }
}
