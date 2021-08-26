import React, { Component } from 'react'

import UserHeader from '../user/UserHeader';
import adminHeader from '../admin/adminHeader';
export default class Header extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  render() {
    return (
      <div>
        {/* <UserHeader /> */}
        <adminHeader />
      </div>
    )
  }
}
