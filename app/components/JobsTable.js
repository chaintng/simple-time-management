import React from 'react';

class JobTable extends React.Component {

  render() {
    return (<div>
      <table border={1}>
        <tr>
          <th>ID</th>
          <th>TITLE</th>
          <th>NOTE</th>
        </tr>
        {this.props.jobs.map((job) => {
          return (<tr>
            <td>{job.id}</td>
            <td>{job.title}</td>
            <td>{job.note}</td>
          </tr>)
        })}
      </table>
    </div>);
  }
}

export default JobTable;
