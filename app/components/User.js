import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadAllUsers } from '../actions/account'

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(loadAllUsers(this.props.token))
  }


  render() {
    return (<div className="container">
        <div className="columns">
          <h3 className="column">Users</h3>
          <div className="column is-one-third" style={{textAlign: 'right', paddingTop: '20px'}}>
            <Link className="button is-light" to="/account?mode=ADD">Create new user</Link>
          </div>
        </div>
        <div>
          <table className="table" style={{width: '100%'}}>
            <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PREF. HOUR</th>
              <th>ROLE</th>
              <th>ACTION</th>
            </tr>
            </thead>
            <tbody>
            {this.props.allUsers.map((user) => {
              return (<tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.preferred_working_hour}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/account?mode=EDIT&user_id=${user.id}`}>Edit</Link>
                  |
                  <a onClick={() => this.props.deleteAction(user.id)}>Del</a>
                </td>
              </tr>)
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    messages: state.messages,
    allUsers: state.job.allUsers
  };
};

export default connect(mapStateToProps)(User);
