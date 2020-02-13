import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

import socketIOClient from "socket.io-client"

var socket;
class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            username: ""
        }
        socket = socketIOClient("http://localhost:3001/")
    }

    checkLoggedIn = () => {
        if (!this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <Navbar.Toggle aria-controls="ToggleBtn" />
                    <Navbar.Collapse id="ToggleBtn">
                    <Form inline onSubmit={this.onSubmit} role="form">
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">@</div>
                            </div>
                            <FormControl name="username" onChange={this.onChange} type="text" placeholder="Enter your name to join..." className="mr-sm-2" />
                            <Button variant="outline-success" type="submit">Join</Button>
                        </div>
                    </Form>
                    </Navbar.Collapse> 
                </React.Fragment>
                )
        }
        else return (
            <Button onClick={this.logout}>Sign Out</Button>
        )
    }

    logout = () => {
        socket.emit("leave", this.state.username)
        this.setState({username: ""})
        this.props.logout(this.state.username);
    }

    onSubmit = (e) => {
        e.preventDefault()
        if(this.state.username === ""){
            return;
        }
        this.props.login(this.state.username)
        socket.emit("Joined", this.state.username)
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