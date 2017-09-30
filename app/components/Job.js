import React from 'react';
import { connect } from 'react-redux'
import { submitJobForm, loadAllJob, deleteJob, changeMode } from '../actions/job';
import Messages from './Messages';
import JobTable from './JobsTable';

class Job extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(loadAllJob(this.props.token))
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
    this.props.dispatch(changeMode('ADD', {}))
  }

  render() {
    return (
      <div className="container columns">
        <div className="column">
          <h3>Jobs ({this.props.mode})</h3>
          <Messages messages={this.props.messages}/>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" value={this.props.jobFormValue.title} onChange={this.handleChange.bind(this)} autoFocus/>
            <label htmlFor="note">Note</label>
            <textarea name="note" id="note" rows="7" value={this.props.jobFormValue.note} onChange={this.handleChange.bind(this)}></textarea>
            <label htmlFor="note">Date</label>
            <input type="date" name="date" id="date" value={this.props.jobFormValue.date} onChange={this.handleChange.bind(this)}/>
            <label htmlFor="note">Hour</label>
            <input type="text" name="hour" id="hour" value={this.props.jobFormValue.hour} onChange={this.handleChange.bind(this)}/>
            <br/>
            <button onClick={this.handleReset.bind(this)}>{this.props.mode === 'ADD' ? 'Reset' : 'Cancel'}</button> -
            <button type="submit">{this.props.mode === 'ADD' ? 'Add' : 'Save'}</button>
          </form>
        </div>
        <div className="column" style={{flexGrow: 6}}>
          { this.props.isLoadingJobs ?
            "Loading..." :
            <JobTable
              jobs={this.props.jobs}
              preferredWorkingHour={this.props.preferredWorkingHour}
              editAction={this.handleEdit.bind(this)}
              deleteAction={this.handleDelete.bind(this)}
            />
          }
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
    preferredWorkingHour: state.auth.user.preferred_working_hour,
  };
};

export default connect(mapStateToProps)(Job);
