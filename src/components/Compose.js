import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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

    render() {
        return (
            <Form onSubmit={this.onSubmit} className="w-100">
                <div className="container">
                <Row>
                    <Col sm={10}>
                        <Form.Control value={this.state.msg} name="msg" onChange={this.onChange} as="textarea" rows="3" />
                    </Col>
                    <Col sm={2}>
                        <Button type="submit">Submit</Button>
                    </Col>
                </Row>
                </div>
            </Form>
        )
    }
}