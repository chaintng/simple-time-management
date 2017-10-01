import React from 'react';

class Messages extends React.Component {
  render() {
    let messageClass = '';
    let messages = []

    if (this.props.messages.success) {
      messageClass = 'is-primary'
      messages = this.props.messages.success
    } else if (this.props.messages.error) {
      messageClass = 'is-danger'
      messages = this.props.messages.error
    } else if (this.props.messages.info) {
      messageClass = 'is-info'
      messages = this.props.messages.info
    }

    return (messages.length > 0 ? <article className={`message ${messageClass}`}>
        <div role="alert" className="message-body">
          {messages.map((message, index) => <div key={index}>{message.msg}</div>)}
        </div>
    </article> : <article></article>)
  }
}

export default Messages;
