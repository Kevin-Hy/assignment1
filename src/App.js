import React from 'react';
import './App.css';

import {Header, socket} from './components/Header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import Users from './components/Users'
import Messages from './components/Messages'
import Compose from './components/Compose'

export default class App  extends React.Component {
  state = {
    isLoggedIn: false,
    username: "",
    messages: [{
      msg: "You need to be logged in in order to be able to send messages. Please be kind and tame to others in the room.",
      by: "The Admin"
    }],
    users: []
  }

  componentDidMount(){
    socket.on("Message", (msg)=>{
      this.setState({messages : [...this.state.messages, msg]})
    })

    socket.on("Joined", (user)=>{
      this.setState({users:[...this.state.users, user]})
    })

    socket.on("Leave", (username)=>{
      this.setState({users:[...this.state.users.filter(user=>user!==username)]})
    })
  }

  logout = (username) => {
    this.setState({
      isLoggedIn: false,
      username: "",
      users: [...this.state.users.filter(user => user!==username)]
    })
    socket.emit("Leave", username)
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
    socket.emit("Message", {msg, by: this.state.username})
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
              <Container fluid>
                <h3 className="text-center" style={{"margin":"10px auto"}}>User List</h3>
              </Container>
              <Container>
                {this.state.users.map(user => <Users user={user}></Users>)}
              </Container>
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

