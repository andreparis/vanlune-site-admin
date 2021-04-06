import React, { Component } from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { User } from 'react-feather';
import { withRouter } from 'react-router-dom';
import api from '../../services/api';
import { URL } from '../../constants/urls';
import { login } from '../../services/auth';
import ReactLoading from 'react-loading';

export class LoginTabset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password:"",
            activeShow: true,
            startDate: new Date(),
            isLogging: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    clickActive = (event) => {
        // document.querySelector(".nav-link").classList.remove('show');
        // event.target.classList.add('show');
    }

    handleChange(event) {
        let new_state = this.state;
        if (event.target.id == "input_email") {
            new_state.email = event.target.value;
        }
        else if (event.target.id == "input_password") {
            new_state.password = event.target.value;
        }

        this.setState(new_state);
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.state.isLogging = true;
        this.setState(this.state);
        const { email, password } = this.state;        
        try {            
            var result = await api.post(URL.ACCOUNT_URL + "/auth", {email, password});
            if (result.data.Error != undefined)
            {
                alert(result.data.Error);
                throw "";
            }
            if (result.data.Content == undefined ||
                result.data.Content.access_token == '' ||
                result.data.Content.access_token == undefined ||
                result.data.Content.user == undefined) {
                throw "";
            }            
            login(result.data.Content.access_token, result.data.Content.user);
            this.props.history.push("/dashboard");
        } catch (ex) { console.log(ex); }
        this.state.isLogging = false;
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <Tabs onChange={ this.handleChange }>
                    <TabList className="nav nav-tabs tab-coupon" >
                        <Tab className="nav-link" onClick={(e) => this.clickActive(e)}><User />Login</Tab>
                    </TabList>

                    <TabPanel>
                        <form className="form-horizontal auth-form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input required="" name="login[username]" type="email" className="form-control" placeholder="Username" id="input_email" />
                            </div>
                            <div className="form-group">
                                <input required="" name="login[password]" type="password" className="form-control" placeholder="Password" id="input_password" />
                            </div>
                            {this.state.isLogging ?
                            <ReactLoading type="Spin" color="black" height={50} width={50} />  
                            :
                            <div className="form-button">    
                                <button className="btn btn-primary" type="submit">Login</button>                                
                            </div>
                            }
                        </form>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(LoginTabset)

