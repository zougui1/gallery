import React, { Component } from 'react';
import Overlay from './Overlay';
class App extends Component {
  render() {
    return (
      <div className="App">
          <Overlay imageTemp="https://www.pokebip.com/membres/galeries/1465/1465641941022086600.png" />
          overlay
      </div>
    );
  }
}

export default App;
