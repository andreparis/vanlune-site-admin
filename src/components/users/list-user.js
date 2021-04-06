import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import Breadcrumb from '../common/breadcrumb';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from '../common/datatable';
import ReactLoading from 'react-loading';
import { getUser } from '../../services/auth';
import { getUsersByFilter,
    getRoles,
    addUserToRoles } from '../../services/users';
import { ThumbsDown } from 'react-feather';

export class List_user extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            users: [],
            roles: [],
            filter: {},
            grants: {users:[], roleId: 1},
            isLoding: false,
            isLoadingRoles: true,
            checkedValues: []
        };  
        getRoles()
        .then(result => {
            this.state.roles = result;
            this.state.isLoadingRoles = false;
            this.setState(this.state);
        });  
    }

    getRoles = async () => {
        let roles = await getRoles();
        return roles;
    }

    getUsers = async () => {
        let users = await getUsersByFilter(this.state.filter);
        this.state.users = users;
        this.state.isLoding = false;
        this.setState(this.state);
    }

    onOpenModal = () => {
        this.state.open = true;
        this.setState(this.state);
    };

    onCloseModal = async (action) => {
        this.state.isLoding = true;
        this.setState(this.state);
        if (action == 'save') {
            var grant = this.state.grants;
            for (var i =0; i < grant['users'].length; i++) {
                let user = this.state.users.filter(u => u['id'] == grant['users'][i])[0];                 
                if (user['RoleId'] != grant['roleId']) {
                    let payload = { userId: grant['users'][i], patches: []};
                    payload['patches'].push({
                        op: 'add',
                        path: '/roles',
                        value: [grant['roleId']]
                    }); 
                    payload['patches'].push({
                        op: 'remove',
                        path: '/roles',
                        value: [user['RoleId']]
                    });  
                    await addUserToRoles(payload);               
                }
            }
        }
        this.state.grants = { };
        this.state.open = false;
        this.setState(this.state);
        await this.getUsers();
    };

    handleModal = (event, id) => {
        if (event.target.checked)
            this.state.grants['roleId'] = id;
        this.setState(this.state);
    }

    handleFilter = async (event) => {
        this.state.filter[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit = async () => {
        this.state.isLoding = true;
        this.setState(this.state);
        await this.getUsers();
    }

    handlerEditRows = async (row) => {
        console.log(row);
        this.state.grants['users'] = row;
        this.setState(this.state);
        this.onOpenModal();
    }

    render() {
        return (
            <Fragment>
                <Breadcrumb title="Customize" parent="Physical" />
                {/* <!-- Container-fluid starts--> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card"> 
                                <div className="card-header">
                                    <h5>Filter</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <Modal open={this.state.open} onClose={this.onCloseModal} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Category</h5>
                                            </div>
                                            <div className="modal-body">
                                                {this.state.roles && this.state.roles.length > 0 ?
                                                this.state.roles.map((item, i) => {
                                                    return (
                                                        <div>
                                                        <span key={i}> {item['Name']}     
                                                            <input type="checkbox" name={item['Name']} onChange={e => this.handleModal(e,item['id'])} />
                                                        </span>
                                                        </div>
                                                    );
                                                })
                                                : ''
                                                }                                                
                                            </div>
                                            <div className="modal-footer">
                                                {this.state.isLoding ? 
                                                <ReactLoading type="balls" color="blue" height={50} width={50} /> 
                                                : 
                                                <>
                                                <button type="button" className="btn btn-primary" onClick={() => this.onCloseModal('save')}>Save</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('close')}>Close</button>
                                                </>
                                                }                                                
                                            </div>
                                        </Modal>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="form-group col-md-6 col-sm-6 col-xs-12">   
                                            <div className="form-control col-form-label-sm">
                                                <div className="form-row col">  
                                                    <label className="col-form-label">User Email
                                                        <input className="form-control" id="validationCustom02" type="text" name="id" onChange={this.handleFilter}/> 
                                                    </label> 
                                                    { this.state.isLoadingRoles ? 
                                                        <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                                                        :
                                                        <label className="col-form-label">Roles
                                                            <select className="custom-select" required="" name="roleId" onChange={this.handleFilter}>
                                                                <option value="">--Select--</option>
                                                                {this.state.roles && this.state.roles.length > 0 > 0 ?
                                                                    this.state.roles.map((item, i) => {
                                                                        return  <option key={i} value={item['id']}>{item['Name']}</option>                                                    
                                                                    })
                                                                : ''
                                                                }
                                                            </select>
                                                        </label>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" aria-posinset="center" type="submit" onClick={this.handleSubmit}>Filter</button>
                                    </div>
                                </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Users</h5>
                                </div>
                                <div className="card-body">
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        {this.state.isLoding ?
                                            <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                                            :
                                            this.state.users && this.state.users.length > 0 ?
                                                <Datatable
                                                    multiSelectOption={false}
                                                    myData={this.state.users} 
                                                    editable={false}
                                                    multiSelectOption={true}
                                                    multiSelectColNames={["Grant"]}
                                                    multiSelectHandler={this.handlerEditRows}
                                                    pageSize={10}
                                                    pagination={true}
                                                    class="-striped -highlight" 
                                                    isConfirm={false}
                                                />
                                                : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Container-fluid Ends--> */}
            </Fragment>
        )
    }
}

export default List_user

