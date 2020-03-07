import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

import socketIOClient from "socket.io-client"
import Container from 'react-bootstrap/Container';

var socket;
class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            username: ""
        }
        socket = socketIOClient()
    }

    checkLoggedIn = () => {
        if (!this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <Navbar.Toggle aria-controls="ToggleBtn" />
                    <Navbar.Collapse id="ToggleBtn">
                    <Container className="float-right w-auto mr-1">
                        <Form inline onSubmit={this.onSubmit} role="form-inline" className="w-auto ">
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">@</div>
                                </div>
                                <FormControl name="username" onChange={this.onChange} type="text" placeholder="Enter your name to join..." className="mr-sm-2" />
                                <Button variant="outline-success" type="submit">Join</Button>
                            </div>
                        </Form>
                    </Container>
                    </Navbar.Collapse> 
                </React.Fragment>
                )
        }
        else return (
            <Container  className="float-right w-auto mr-1">
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                        <input disabled type="text" style={{"maxWidth":"10vw"}} defaultValue={this.state.username}></input>
                    </div>
                    <Button onClick={this.logout}>Sign Out</Button>
                </div>
            </Container>
        )
    }

    sendLastEmit = () => socket.emit("user-disconnect", this.state.username)
    
    componentWillUnmount() {
        this.sendLastEmit();
        window.removeEventListener('beforeunload', this.sendLastEmit)
    }

    componentDidMount() {

        window.addEventListener("beforeunload", this.sendLastEmit)

        socket.on("check-usr", ({found, users})=>{
            if(!found){
                //console.log(users)
                this.props.login(this.state.username)
                this.props.setUsers(users)
            }
            else console.log("name not available")
        })
    }

    logout = () => {
        this.props.logout(this.state.username);
        //console.log(this.state.username)
        this.setState({username: ""})
    }

    onSubmit = (e) => {
        e.preventDefault()
        if(this.state.username === ""){
            return;
        }
        socket.emit("check-usr", this.state.username)
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value})

    render() {
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>Weebiee Chat-App</Navbar.Brand>
                <this.checkLoggedIn />
            </Navbar>
        )
    }
}

export {Header, socket}