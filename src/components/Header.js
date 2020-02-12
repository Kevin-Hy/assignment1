import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

export default class Header extends React.Component {

    state = {
        username: ""
    }

    checkLoggedIn = () => {
        if (!this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <Navbar.Toggle aria-controls="ToggleBtn" />
                    <Navbar.Collapse id="ToggleBtn">
                    <Form inline onSubmit={this.onSubmit} role="form">
                        <FormControl name="username" onChange={this.onChange} type="text" placeholder="Enter your name to join..." className="mr-sm-2" />
                        <Button variant="outline-success" type="submit">Join</Button>
                    </Form>
                    </Navbar.Collapse> 
                </React.Fragment>
                )
        }
        else return (
            <Button onClick={this.props.logout}>Sign Out</Button>
        )
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.login(this.state.username)
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