import React from 'react';

class JobTable extends React.Component {

  render() {
    return (<div>
      <table className="table" style={{width: '100%'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>NOTE</th>
            <th>DATE</th>
            <th>HOURS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {this.props.jobs.map((job) => {
            return (<tr>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.note}</td>
              <td className="center">{job.date}</td>
              <td className="center">{job.hours}</td>
              <td className="center">
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
