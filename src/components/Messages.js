import React from 'react';
import Card from 'react-bootstrap/Card'

export default class Messages extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            isMine : this.props.user === this.props.message.by ? true : false,
            isSystem: (this.props.message.by === "System" || this.props.message.by==="The Admin")
        }
    }

    render() {
        return(
            <Card border={this.state.isSystem ? 'danger' : 'light'} className={ this.state.isMine ? 'message-r' : 'message-l'} >
                <Card.Body>
                    <blockquote className="blockquote mb-0">
                        <p>
                            {' '}
                            {this.props.message.msg}
                            {' '}
                        </p>
                        <footer className="blockquote-footer">
                            {this.props.message.by}
                        </footer>
                    </blockquote>
                </Card.Body>
            </Card>
        )
    }
}