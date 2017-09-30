export function submitJobForm(mode, job, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/job', {
      method: mode === 'ADD' ? 'post' : 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(job)
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'JOB_SUBMIT_SUCCESS',
            messages: [json]
          });
          dispatch(loadAllJob(token))
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'JOB_SUBMIT_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function loadAllJob(token) {
  return (dispatch) => {
    dispatch({
      type: 'BEGIN_LOAD_ALL_JOBS'
    })

    return fetch('/job-list', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FINISH_LOAD_ALL_JOBS',
            jobs: json
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'ERROR_LOAD_ALL_JOBS',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}

export function changeMode(mode, jobFormValue) {
  return (dispatch) => {
    dispatch({
      type: 'CHANGE_MODE',
      mode,
      jobFormValue
    })
  }
}


export function deleteJob(jobId, token) {
  return (dispatch) => {
    dispatch({
      type: 'BEGIN_LOAD_ALL_JOBS'
    })

    return fetch('/job', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        jobId
      })
    }).then((response) => {
      if (response.ok) {
        dispatch(loadAllJob(token))
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'ERROR_LOAD_ALL_JOBS',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  }
}
