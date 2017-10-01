import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateProfile, changePassword, deleteAccount } from '../../actions/auth';
import { fetchProfile } from '../../actions/account'
import { link, unlink } from '../../actions/oauth';
import Messages from '../Messages';
import { browserHistory } from 'react-router'
import { ACCESS_ROLES, USER_ROLES } from '../../../config/constants'
import { initialState } from '../../reducers/account'

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.editUserProfileMode = this.props.location.query.mode === 'EDIT'
    this.addUserProfileMode = this.props.location.query.mode === 'ADD'

    if (ACCESS_ROLES.CAN_CRUD_USER_JOBS.indexOf(this.props.user.role) < 0 && this.editUserProfileMode) {
      browserHistory.push('/')
    }
    const userId = this.editUserProfileMode ? this.props.location.query.user_id : this.props.user.id

    if (this.addUserProfileMode) {
      this.props.dispatch({
        type: 'CHANGE_USER_FORM',
        user: initialState.userForm,
      });
    } else {
      this.props.dispatch(fetchProfile(userId, this.props.token))
    }
  }

  handleChange(event) {
    this.props.dispatch({
      type: 'CHANGE_USER_FORM',
      user: Object.assign({}, this.props.userForm, { [event.target.name]: event.target.value }),
    });
  }

  handleProfileUpdate(event) {
    event.preventDefault();
    this.props.dispatch(updateProfile(this.props.userForm, this.props.token, this.addUserProfileMode));
  }

  handleChangePassword(event) {
    event.preventDefault();
    this.props.dispatch(changePassword(this.props.userForm.id, this.props.userForm.password, this.props.userForm.confirm, this.props.token));
  }

  handleDeleteAccount(event) {
    event.preventDefault();
    this.props.dispatch(deleteAccount(this.props.token));
  }

  handleLink(provider) {
    this.props.dispatch(link(provider))
  }

  handleUnlink(provider) {
    this.props.dispatch(unlink(provider));
  }

  render() {
    const googleLinkedAccount = this.props.user.google ? (
      <a href="#" role="button" className="text-alert" onClick={this.handleUnlink.bind(this, 'google')}>Unlink your Google account</a>
    ) : (
      <a href="#" role="button" onClick={this.handleLink.bind(this, 'google')}>Link your Google account</a>
    );
    return (
      <div className="container">
        {this.editUserProfileMode || this.addUserProfileMode ?
          <div>
            <h3>{this.props.location.query.mode} User Profile {this.props.editUserProfileMode ? `(User ID: ${this.props.userForm.id})` : ''}</h3>
            <Link to="/users">&lt;-- Back to User page</Link>
          </div>
          : ''}
        <Messages messages={this.props.messages}/>
        <div className="columns">
        <form onSubmit={this.handleProfileUpdate.bind(this)} className="column">
          <h4>Profile Information</h4>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" value={this.props.userForm.email} onChange={this.handleChange.bind(this)}/>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" value={this.props.userForm.name} onChange={this.handleChange.bind(this)}/>
          <label>Gender</label>
          <input type="radio" name="gender" id="male" value="male" checked={this.props.userForm.gender === 'male'} onChange={this.handleChange.bind(this)}/>
          <label htmlFor="male">Male</label>
          <input type="radio" name="gender" id="female" value="female" checked={this.props.userForm.gender === 'female'} onChange={this.handleChange.bind(this)}/>
          <label htmlFor="female">Female</label>
          <label htmlFor="preferred_working_hour">Preferred Working Hour</label>
          <input type="text" name="preferred_working_hour" id="preferred_working_hour" value={this.props.userForm.preferred_working_hour} onChange={this.handleChange.bind(this)}/>
          <label htmlFor="role">Role</label>
          <select name="role" value={this.props.userForm.role} onChange={this.handleChange.bind(this)}>
            {Object.values(USER_ROLES).map((item, index) => {
              return (<option key={item} value={item}>{item}</option>)
            })}
          </select>

          {this.addUserProfileMode ? <div>
            <label htmlFor="password">New Password</label>
            <input type="password" name="password" id="password" onChange={this.handleChange.bind(this)}/>
            <label htmlFor="confirm">Confirm Password</label>
            <input type="password" name="confirm" id="confirm" onChange={this.handleChange.bind(this)}/>
          </div> : ''}

          <br/>
          <button type="submit">{this.addUserProfileMode ? 'Create User' : 'Update Profile'}</button>
        </form>
        <form onSubmit={this.handleChangePassword.bind(this)} className="column" style={this.addUserProfileMode ? {display: 'none'} : {}}>
          <h4>Change Password</h4>
          <label htmlFor="password">New Password</label>
          <input type="password" name="password" id="password" onChange={this.handleChange.bind(this)}/>
          <label htmlFor="confirm">Confirm Password</label>
          <input type="password" name="confirm" id="confirm" onChange={this.handleChange.bind(this)}/>
          <br/>
          <button type="submit">Change Password</button>
        </form>
        <form onSubmit={this.handleDeleteAccount.bind(this)} className="column" style={this.addUserProfileMode ? {display: 'none'} : {}}>
          {!this.editUserProfileMode ? <div>
            <h4>Linked Accounts</h4>
            <p>{googleLinkedAccount}</p>
          </div> : ''}
          <h4>Delete Account</h4>
          <p>You can delete your account, but keep in mind this action is irreversible.</p>
          <button type="submit">Delete my account</button>
        </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    messages: state.messages,
    userForm: state.account.userForm
  };
};

export default connect(mapStateToProps)(Profile);
