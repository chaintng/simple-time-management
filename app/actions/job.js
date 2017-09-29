export function submitJobForm(title, note, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/job', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        note
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'CONTACT_FORM_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CONTACT_FORM_FAILURE',
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