import React from 'react';
import { connect } from 'react-redux'
import { submitJobForm, loadAllJob } from '../actions/job';
import Messages from './Messages';
import JobTable from './JobsTable';

class Job extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '', note: '' };
  }

  componentDidMount() {
    this.props.dispatch(loadAllJob(this.props.token))
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(submitJobForm(this.state.title, this.state.note, this.props.token));
  }

  render() {
    return (
      <div className="container">
        <h3>Jobs</h3>
        <Messages messages={this.props.messages}/>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={this.state.name} onChange={this.handleChange.bind(this)} autoFocus/>
          <label htmlFor="note">Note</label>
          <textarea name="note" id="note" rows="7" value={this.state.message} onChange={this.handleChange.bind(this)}></textarea>
          <br/>
          <button type="submit">Send</button>
        </form>
        { this.props.isLoadingJobs ? <div>I'm Loading</div> : <JobTable jobs={this.props.jobs} /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    messages: state.messages,
    jobs: state.job.jobs,
    isLoadingJobs: state.job.isLoadingJobs
  };
};

export default connect(mapStateToProps)(Job);
