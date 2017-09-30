import React from 'react';

class JobTable extends React.Component {

  render() {
    const totalTime = this.props.jobs.reduce((prev, cur) => {
      return prev + cur.hour
    }, 0)

    const allUserName = new Set()
    this.props.jobs.map((item) => {
      allUserName.add(item.user_name)
    })

    return (<table className="table" style={{width: '100%'}}>
      <tbody>
        <tr style={this.props.hideUserName ? {display: 'none'} : {}}>
          <td>User:</td>
          <td>{Array.from(allUserName).join(', ')}</td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>{this.props.dateFrom} to {this.props.dateTo}</td>
        </tr>
        <tr>
          <td>Total times:</td>
          <td>{totalTime} hour(s)</td>
        </tr>
        <tr>
          <td>Note:</td>
          <td>
            {this.props.jobs.map((item, index) => {
              return (<li key={index}>{item.note}</li>)
            })}
          </td>
        </tr>
      </tbody>
    </table>);
  }
}

export default JobTable;
