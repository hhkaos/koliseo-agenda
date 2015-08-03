import React from 'react';

/*

  Display the "Loading..." text and bars
  Kudos to http://codepen.io/wiiiiilllllll/pen/emuqn

*/
class Loading {

  constructor(props) {
    this.state = {
      message: 'Loading'
    };

    fetch(props.url)
    .then(this.cookData.bind(this))
    .catch(function(ex) {
      console.log('Parsing failed', ex);
      this.setState({ message: 'Error connecting to server '});
    })
  }

  cookData(json) {
    console.log(json);
  }

  render() {
    return (
      <div className="kl">
        <h1>{state.message}...</h1>
        <div className="kl-container">
          <div className="kl-bar-part"></div>
          <div className="kl-bar-part"></div>
          <div className="kl-bar-part"></div>
          <div className="kl-bar-part"></div>
          <div className="kl-bar-part"></div>
          <div className="kl-bar-part"></div>
        </div>
      </div>
    );
  }

}

export { Loading };
