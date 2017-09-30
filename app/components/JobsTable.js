import React from 'react';

class JobTable extends React.Component {

  render() {
    return (<div>
      <table className="table" style={{width: '100%'}}>
        <thead>
          <tr>
            <th style={{display: 'none'}}>ID</th>
            <th>DATE</th>
            <th style={this.props.hideUserName ? {display: 'none'} : {}}>USER</th>
            <th>TITLE</th>
            <th>NOTE</th>
            <th>HOURS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {this.props.jobs.map((job) => {
            return (<tr key={job.id} className={this.props.preferredWorkingHour >= job.hour ? 'green' : 'red'}>
              <td style={{display: 'none'}}>{job.id}</td>
              <td>{job.date}</td>
              <td style={this.props.hideUserName ? {display: 'none'} : {}}>{job.user_name}</td>
              <td>{job.title}</td>
              <td>{job.note}</td>
              <td>{job.hour}</td>
              <td>
                <a onClick={() => this.props.editAction(job)}>Edit</a>
                |
                <a onClick={() => this.props.deleteAction(job.id)}>Del</a>
              </td>
            </tr>)
          })}
        </tbody>
      </table>
    </div>);
  }
}

export default JobTable;
