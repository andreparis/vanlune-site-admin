import React, { Component } from 'react'
import { getUser } from '../../../services/auth';

export class User_panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: getUser()
        }
    }
    render() {
        return (
            <div>
                <div className="sidebar-user text-center">
                    <h6 className="mt-3 f-14">{this.state.user['name']}</h6>
                    <p>{this.state.user['role']}</p>
                </div>
            </div>
        )
    }
}

export default User_panel

