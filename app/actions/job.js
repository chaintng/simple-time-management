const queryString = require('query-string')

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
      body: JSON.stringify({
        id: job.id,
        user_id: job.user_id,
        title: job.title,
        note: job.note,
        hour: job.hour,
        date: job.date,
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'JOB_SUBMIT_SUCCESS',
            messages: [json]
          });
          dispatch(loadAllJob({
            dateFrom: document.getElementById('filterDateFrom').value,
            dateTo: document.getElementById('filterDateTo').value
          }, token))
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

export function loadAllJob(filter, token, exportDisplay = false) {
  return (dispatch) => {
    dispatch({
      type: 'BEGIN_LOAD_ALL_JOBS'
    })

    return fetch(`/job-list?${queryString.stringify({
      date_from: filter.dateFrom,
      date_to: filter.dateTo
    })}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FINISH_LOAD_ALL_JOBS',
            jobs: json,
            exportDisplay
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


export function loadAllUsers(token) {
  return (dispatch) => {
    return fetch('/user-list', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      return response.json().then((json) => {
        dispatch({
          type: 'FINISH_LOAD_ALL_USERS',
          users: json,
        });
      });
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
        dispatch(loadAllJob({}, token))
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
