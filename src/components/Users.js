import React from 'react'
import Card from 'react-bootstrap/Card'

export default class Users extends React.Component{
    render() {
        return (
            <Card body>
                {this.props.user}
            </Card>
        )
    }
}