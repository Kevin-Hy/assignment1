import React from 'react';
import './App.css';

import {Header} from './components/Header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Users from './components/Users'
import Messages from './components/Messages'
import Compose from './components/Compose'

export default class App  extends React.Component {
  state = {
    isLoggedIn: false,
    username: "",
    messages: [{
      msg: "You're a weeb",
      by: "AshenCat"
    },
    {
      msg: "No, you're a weeb",
      by: "Eagur"
    },
    {
      msg: "NOOO, You're a weeb",
      by: "David"
    }],
    users: ["Eagur", "David", "AshenCat"]
  }

  logout = (username) => {
    this.setState({
      isLoggedIn: false,
      username: "",
      users: [...this.state.users.filter(user => user!==username)]
    })
  }

  login = (username) => {
    this.setState({
      username, 
      isLoggedIn: true,
      users: [...this.state.users, username]
    })
  }

  sendMessage = (msg) => {
      this.setState({messages : [...this.state.messages, {msg, by: this.state.username}]})
  }

  style = () => {
    return{
      border: "1px solid black",
      height: "100%"
    }
  }

  render(){
    return (
      <main className="App h-100">
        <Header isLoggedIn={this.state.isLoggedIn} logout={this.logout} login={this.login}></Header>
        <section className="container-fluid h-100">
        <div className="container-fluid">
          <Row className="justify-content-center h-100">
            <Col sm={9} className="messageList">
              {this.state.messages.map(message => <Messages message={message} user={this.state.username}></Messages>)}
            </Col>
            <Col  sm={3}>
              {this.state.users.map(user => <Users user={user}></Users>)}
            </Col>

          </Row>
          <Row>
            <Compose sendMessage={this.sendMessage} user={this.state.username}/>
          </Row>
        </div>
        </section>
      </main>
    );
  }
}

