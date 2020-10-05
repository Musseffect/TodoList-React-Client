import React, { Component } from 'react';
import {setTitle} from "../actions/actions.js";

class NoMatchPage extends Component {
  constructor(props)
  {
      super(props);
  }
  componentDidMount()
  {
    setTitle("Page 404");
  }
  render() {
    let {} = this.props;
    return (
      <div className='page404'>
        Page 404
      </div>
    )
  }
}

export default NoMatchPage;