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
      by: "The Admin",
      _id: 0
    }],
    users: [],
    room: ""
  }

  ctr=1;

  componentDidMount(){
    socket.on("Message", (msg)=>{
      this.setState({messages : [...this.state.messages, msg]})
      console.log("got message")
    })

    socket.on("join", (user) => {
      this.setState({users: [...this.state.users, user]})
    })

    socket.on("userLeave", (user)=>{
      //console.log(`${user} logging out`)
      this.setState({users: [...this.state.users.filter(usr => usr !== user)]})
    })

    socket.on("listening", (user)=>{
      this.setState({messages: [...this.state.messages, {msg: `${user} is now listening at this room.`, by: "System", _id: this.ctr+=1}]})
    })

    socket.on("userUnlisten", (user)=> {
      this.setState({messages: [...this.state.messages, {msg: `${user} is not listening to this room anymore.`, by: "System", _id: this.ctr+=1}]})
    })

    socket.on("MessageReceive", (res)=>{
      console.log("incoming message")
      this.setState({messages: [...this.state.messages, {msg: res.msg, by: res.by, _id: this.ctr+=1}]})
    })
  }

  setUsers = (userlist) => {
    this.setState({users: [...userlist, this.state.username]})
  }

  logout = (username) => {
    //console.log(`${username} logging out`)
    socket.emit("leave", {user:username, room:this.state.room})
    this.setState({
      isLoggedIn: false,
      username: "",
      users: [],
      room: "",
      messages: []
    })
  }

  login = (username) => {
    this.setState({
      username, 
      isLoggedIn: true
    })
  }

  sendMessage = (msg) => {
    msg=msg.trim()
    if (this.state.room !== "" && this.state.username !== "") {
      this.setState({messages : [...this.state.messages, {msg, by: this.state.username, _id: this.ctr+=1}]})
      socket.emit("Message", {msg, by: this.state.username, room: this.state.room})
    }
    else if (this.state.room === "")
      this.setState({messages : [...this.state.messages, {msg: "You have to be in a room to send a message!", by: "System", _id: this.ctr+=1}]})
    else if(this.state.username === "")
      this.setState({messages : [...this.state.messages, {msg: "You need to be logged-in to send a message!", by: "System", _id: this.ctr+=1}]})
      //console.log(`${msg}, ${this.state.username}, ${this.state.room}`)
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  join = (e) => {
    //console.log(e.target.name)
    socket.emit("unlisten", {user:this.state.username, room:this.state.room})
    this.setState({room: e.target.name}, () =>{
      socket.emit("listen", {user:this.state.username, room:this.state.room})
    })
    this.setState({messages: [...this.state.messages, {msg: `You're now listening  @${e.target.name} room`, by: "System", _id: this.ctr+=1}]})
    
  }

  

  render(){
    return (
      <main className="App h-100">
        <Header setUsers={this.setUsers} isLoggedIn={this.state.isLoggedIn} logout={this.logout} login={this.login} ></Header>
        <section className={this.state.username === "" ? "container-fluid h-100 ninja" : "container-fluid h-100"}>
        <div className="container-fluid">
          <Row className="justify-content-center h-100">
            <Col sm={9}>
              <div className="card">
                <div className="card-header">
                  <h5 style={{'display':'inline-block'}}>Messages</h5>
                </div>
                <div className="messageList">
                  {this.state.messages.map(message => <Messages key={message._id} message={message} user={this.state.username}></Messages>)}
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
                    <Card.Header>Global User List</Card.Header>
                    <Card.Body>{this.state.users.map(user => <Users key={user} user={user}></Users>)}</Card.Body>
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

