import React from 'react'
import Card from 'react-bootstrap/Card'

export default class Users extends React.Component{
    render() {
        return (
            <Card body>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                        <input disabled type="text" style={{"maxWidth":"10vw"}} defaultValue={this.props.user}></input>
                    </div>
                </div>
            </Card>
        )
    }
}