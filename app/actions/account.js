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

export function fetchProfile(userId, token) {
  return (dispatch) => {
    return fetch(`/user?user_id=${userId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      return response.json().then((json) => {
        dispatch({
          type: 'CHANGE_USER_FORM',
          user: json,
        });
      });
    });
  }
}