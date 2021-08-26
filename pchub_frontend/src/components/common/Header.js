import React, { Component } from 'react';
import UserHeader from '../user/UserHeader';
import adminHeader from '../admin/adminHeader';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    }
    // console.log(this.props.user);
  }

  componentDidMount() {
  }


  render() {
    return (
      <div>
        <UserHeader user={this.state.user}/>
      </div>
    );
  }
}
