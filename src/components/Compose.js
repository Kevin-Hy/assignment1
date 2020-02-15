import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

export default class Compose extends React.Component {

    state = {
        msg:""
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.sendMessage(this.state.msg)
        this.setState({msg:""})
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleKeyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault()
            let msg = this.state.msg.trim();
            if (msg === "" || this.props.user === ""){
                return;
            }
            this.props.sendMessage(msg)
            this.setState({msg:""})
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} className="w-100 mt-3">
                <div className="input-group">
                    <Form.Control value={this.state.msg} name="msg" 
                    onChange={this.onChange} as="textarea" rows="3" 
                    onKeyDown={this.handleKeyDown}
                    className="left-rnd type-msg" />
                    <Button classname="input-group-text send-btn" type="submit">Submit</Button>
                </div>
            </Form>
        )
    }
}