import React from 'react';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <section className="is-medium">
          {this.props.children}
        </section>
        <Footer/>
      </div>
    );
  }
}

export default App;
