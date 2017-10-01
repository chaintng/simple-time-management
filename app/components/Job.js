import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import { submitJobForm, loadAllJob, deleteJob, changeMode } from '../actions/job';
import { loadAllUsers } from '../actions/account'
import Messages from './Messages';
import JobTable from './JobsTable';
import JobExport from './JobsExport';
import { initialState } from '../reducers/job'
import { ACCESS_ROLES } from "../../config/constants";

class Job extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.firstDay = moment().startOf('month');
    this.lastDay = moment().endOf('month');
  }

  componentDidMount() {
    this.props.dispatch(loadAllJob({
      dateFrom: document.getElementById('filterDateFrom').value,
      dateTo: document.getElementById('filterDateTo').value
    }, this.props.token))

    this.props.dispatch(loadAllUsers(this.props.token))
  }

  handleChange(event) {
    this.props.dispatch(changeMode(this.props.mode, { [event.target.name]: event.target.value }))
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(submitJobForm(this.props.mode, this.props.jobFormValue, this.props.token));
  }

  handleEdit(job) {
    this.props.dispatch(changeMode('EDIT', job))
  }

  handleDelete(jobId) {
    this.props.dispatch(deleteJob(jobId, this.props.token))
  }

  handleReset(event) {
    event.preventDefault();
    this.props.dispatch(changeMode('ADD', initialState.jobFormValue))
  }

  handleFilterSubmit(event) {
    event.preventDefault();
    this.props.dispatch(loadAllJob({
      dateFrom: document.getElementById('filterDateFrom').value,
      dateTo: document.getElementById('filterDateTo').value
    }, this.props.token))
  }

  handleExport(event) {
    event.preventDefault();
    this.props.dispatch(loadAllJob({
      dateFrom: document.getElementById('filterDateFrom').value,
      dateTo: document.getElementById('filterDateTo').value
    }, this.props.token, true))
  }

  render() {
    const canCRUDuserJobs = ACCESS_ROLES.CAN_CRUD_USER_JOBS.indexOf(this.props.userRole) >= 0
    const bodyData = this.props.exportDisplay === true ? <JobExport
      jobs={this.props.jobs}
      dateFrom={document.getElementById('filterDateFrom').value}
      dateTo={document.getElementById('filterDateTo').value}
      hideUserName={!canCRUDuserJobs}
    /> : <JobTable
      jobs={this.props.jobs}
      editAction={this.handleEdit.bind(this)}
      deleteAction={this.handleDelete.bind(this)}
      hideUserName={!canCRUDuserJobs}
    />
    return (<div className="container">
        <div>
          <h3>Jobs ({this.props.mode})</h3>
          <Messages messages={this.props.messages}/>
        </div>
        <div className="columns">
          <div className="column">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label htmlFor="title">Title</label>
              <input type="text" name="title" id="title" value={this.props.jobFormValue.title} onChange={this.handleChange.bind(this)} autoFocus/>
              <label htmlFor="note">Note</label>
              <textarea name="note" id="note" rows="7" value={this.props.jobFormValue.note} onChange={this.handleChange.bind(this)}></textarea>
              <label htmlFor="note">Date</label>
              <input type="date" name="date" id="date" value={this.props.jobFormValue.date} onChange={this.handleChange.bind(this)}/>
              <label htmlFor="note">Hour</label>
              <input type="text" name="hour" id="hour" value={this.props.jobFormValue.hour} onChange={this.handleChange.bind(this)}/>

              {canCRUDuserJobs ? <div>
                <label htmlFor="user_id">User:</label>
                <select name="user_id" value={this.props.jobFormValue.user_id} onChange={this.handleChange.bind(this)}>
                  {this.props.allUsers.map((item) => {
                    return (<option value={item.id}>{`${item.id}: ${item.name}`}</option>)
                  })}
                </select>
              </div> : ''}
              <button onClick={this.handleReset.bind(this)}>{this.props.mode === 'ADD' ? 'Reset' : 'Cancel'}</button> -
              <button type="submit">{this.props.mode === 'ADD' ? 'Add' : 'Save'}</button>
            </form>
          </div>
          <div className="column" style={{flexGrow: 6}}>
            <div className="filter">
              <form onSubmit={this.handleFilterSubmit.bind(this)}>
                <div>Filter by:</div>
                <div>
                <label htmlFor="filterDateFrom">Date From:</label>
                  <input type="date" name="filterDateFrom" id="filterDateFrom" defaultValue={this.firstDay.format('YYYY-MM-DD')}/>
                </div>
                <div>
                <label htmlFor="filterDateTo">Date To:</label>
                  <input type="date" name="filterDateTo" id="filterDateTo" defaultValue={this.lastDay.format('YYYY-MM-DD')}/>
                </div>
                <button type="submit" name="filter">Filter</button>
              </form>
              <button name="export" onClick={this.handleExport.bind(this)}>Export</button>
            </div>
            { this.props.isLoadingJobs ?
              "Loading..." : bodyData
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    messages: state.messages,
    jobs: state.job.jobs,
    isLoadingJobs: state.job.isLoadingJobs,
    mode: state.job.mode,
    jobFormValue: state.job.jobFormValue,
    exportDisplay: state.job.exportDisplay,
    userRole: state.auth.user.role,
    allUsers: state.job.allUsers
  };
};

export default connect(mapStateToProps)(Job);
