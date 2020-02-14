import React from 'react';
import './App.css';

import {Header, socket} from './components/Header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

import Users from './components/Users'
import Messages from './components/Messages'
import Compose from './components/Compose'

export default class App  extends React.Component {
  state = {
    isLoggedIn: false,
    username: "",
    messages: [{
      msg: "You need to be in a room and logged-in in order to be able to send messages. Please be kind and tame to others in the room.",
      by: "The Admin"
    }],
    users: [],
    room: ""
  }

  componentDidMount(){
    socket.on("Message", (msg)=>{
      this.setState({messages : [...this.state.messages, msg]})
      console.log("got message")
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
    msg=msg.trim()
    if (this.state.room !== "" && this.state.username !== "") {
      this.setState({messages : [...this.state.messages, {msg, by: this.state.username}]})
      socket.emit("Message", {msg, by: this.state.username, room: this.state.room})
    }
    else if (this.state.room === "")
      this.setState({messages : [...this.state.messages, {msg: "You have to be in a room to send a message!", by: "System"}]})
    else if(this.state.username === "")
      this.setState({messages : [...this.state.messages, {msg: "You need to be logged-in to send a message!", by: "System"}]})
      //console.log(`${msg}, ${this.state.username}, ${this.state.room}`)
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  join = (e) => {
    //console.log(e.target.name)
    this.setState({room: e.target.name})
    socket.emit("join", e.target.name)
    this.setState({messages: [...this.state.messages, {msg: `You joined ${e.target.name} room`, by: "System"}]})
  }

  render(){
    return (
      <main className="App h-100">
        <Header isLoggedIn={this.state.isLoggedIn} logout={this.logout} login={this.login}></Header>
        <section className="container-fluid h-100">
        <div className="container-fluid">
          <Row className="justify-content-center h-100">
            <Col sm={9}>
              <div className="card">
                <div className="card-header">
                  <h5 style={{'display':'inline-block'}}>Messages</h5>
                </div>
                <div className="messageList">
                  {this.state.messages.map(message => <Messages message={message} user={this.state.username}></Messages>)}
                  <div>{' '}</div>
                </div>
              </div>
            </Col>
            <Col sm={3} className="p-0">
              <Container className="p-0">
                <Container fluid className="p-0">
                  <Card className="text-center">
                    <Card.Header>Rooms</Card.Header>
                    <Card.Body>
                      <ListGroup>
                        <ListGroup.Item name="Gaming" action onClick={this.join}>Gaming</ListGroup.Item>
                        <ListGroup.Item name="Productivity" action onClick={this.join}>Productivity</ListGroup.Item>
                        <ListGroup.Item name="Memes" action onClick={this.join}>MEMES</ListGroup.Item>
                        <ListGroup.Item name="Dreams" action onClick={this.join}>DREAMS</ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Container>
                <Container fluid className="p-0">
                  <Card className="text-center userListOuter">
                    <Card.Header>User List</Card.Header>
                    <Card.Body>{this.state.users.map(user => <Users user={user}></Users>)}</Card.Body>
                  </Card>
                </Container>
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

