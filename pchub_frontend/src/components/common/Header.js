import React, { Component } from 'react';
import UserHeader from '../user/UserHeader';
import adminHeader from '../admin/adminHeader';

//services
import AuthService from '../../services/AuthService';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      isAdmin: false,
    }
    // console.log(this.props.user);
  }

  async getUserData(){
    var uData = await AuthService.getUserData();
    var uInfo = null;

    if(uData != null){
      var uInfo = uData.userData;
      this.setState({
        isAdmin: uInfo.isAdmin,
      })
    }

  }

  componentDidMount() {

  
    this.getUserData();

  }

  


  render() {
    let head;
    if (this.state.isAdmin) {
      head = <adminHeader />
    } else {
      
     head = <UserHeader user={this.state.user}/>
   
    }

    return (
      <div>{head}</div>
    );
  }
}
