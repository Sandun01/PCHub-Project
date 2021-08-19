import React, { Component } from 'react'

import UserHeader from './UserHeader';
export default class Header extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  render() {
    return (
      <div>
        <UserHeader />
      </div>
    )
  }
}
