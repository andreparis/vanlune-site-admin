import React, { Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from '../common/datatable';
import ReactLoading from 'react-loading';
import { createNewCustomize, 
    getCustomizeByFilter,
    getGames,
    updateCustomizes,
    deleteCustomizes } from '../../services/products';

export class Customizes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            newCustomize: {name: "", game:{id:1}, value:[]},
            newValues: [{name: '', factor:''}],
            games: [],
            customizes: [],
            filter: {name:'', game: 1},
            isLoding: false,
            isLoadingGames: true
        };
        this.getAllGames()
        .then(result => {
            console.log(result);
            if (result && result.length > 0) {
                this.state.games = result;
                this.state.isLoadingGames = false;
                this.setState(this.state);
            }
        });      
    }

    getAllGames = async () => {
        let games = await getGames();
        return games;
    }

    getCustomizes = async () => {
        let customizes = await getCustomizeByFilter(this.state.filter);
        this.state.customizes = customizes;
        this.state.isLoding = false;
        this.setState(this.state);
    };

    

    onOpenModal = () => {
        this.state.open = true;
        this.setState(this.state);
    };

    onCloseModal = async (action) => {
        this.state.isLoding = true;
        this.setState(this.state);
        if (action == "save") {
            this.state.newCustomize['value'] = this.state.newValues.filter(x => x['name'] != '');
            let result = await createNewCustomize([this.state.newCustomize]);
            if (result == 0)
                alert("Category was not created!");
            else
                await this.getCustomizes();
        }
        this.state.newValues = [{name: '', factor:''}];
        this.state.open = false;
        this.setState(this.state);
    };

    handleFilter = (event) => {
        this.state.filter[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handleGame = (event) => {
        this.state.filter['game'] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit = async () => {
        this.state.isLoding = true;
        this.setState(this.state);
        await this.getCustomizes();
    }

    handleModal = (event) => {
        console.log(event.target.value);
        if (event.target.name == 'game')
            this.state.newCustomize['game']['id'] = event.target.value;
        else
            this.state.newCustomize[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handlerEditRow = async (row) => {
        console.log(row);
        this.state.isLoding = true;
        this.setState(this.state);

        let update = await updateCustomizes([{
            id: row['id'],
            name: row['name'], 
            value: row['value'],
            game: {
                id: 1
            }}]);
        if (update == 1) {
            alert("Updated success!"); 
            this.getCustomizes();
        }
        else alert("Failed to update!");
    }

    handleDeleteRow = async (row) => {
        this.state.isLoding = true;
        this.setState(this.state);

        let deleteItem = await deleteCustomizes(row['id']);
        if (deleteItem == 1) {
            alert("Deleted success!"); 
            this.getCustomizes();
        }
        else alert("Failed to delete. Check if there is one or more product in this category!")
    }

    handleEditRowModal = (row) => {
        if (this.state.newValues[0]['name'] == '')
            this.state.newValues[0] = row;
        else if (!this.state.newValues.includes(row))
            this.state.newValues.push(row);
        this.state.newValues.push({name: '', factor:''});
        this.setState(this.state);
    }

    handleDeleteRowModal = (row) => {
        if (row['name'] != '' && row['factor'] != '')
            this.state.newValues = this.state.newValues.filter(data => data['name'] != row['name'] && data['factor'] != row['factor']);
        this.setState(this.state);
    }

    render() {
        const { open } = this.state;
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
                                    <div className="clearfix"></div>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">   
                                        <div className="form-control col-form-label-sm">    
                                        { this.state.isLoadingGames ?
                                            <ReactLoading type="balls" color="blue" height={50} width={50} /> 
                                            : 
                                            <div className="form-row col">  
                                                
                                                <label className="col-form-label">Game
                                                    <select className="custom-select" required="" name="game" onChange={this.handleFilter}>
                                                        <option value="">--Select--</option>
                                                        {this.state.games && this.state.games.length > 0 > 0 ?
                                                            this.state.games.map((item, i) => {
                                                                return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                            })
                                                        : ''
                                                        }
                                                    </select>
                                                </label>
                                                <label className="col-form-label">Name
                                                    <input className="form-control" id="validationCustom02" type="text" name="name" onChange={this.handleFilter}/> 
                                                </label>   
                                            </div>
                                        }
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" aria-posinset="center" type="submit" onClick={this.handleSubmit}>Filter</button>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Customizes</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">

                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add Customize</button>
                                        <Modal open={open} onClose={this.onCloseModal} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Customize</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="form-group">
                                                        <label className="col-form-label">Game
                                                            <select className="custom-select" required="" name="game" onChange={this.handleModal}>
                                                                <option value="">--Select--</option>
                                                                {this.state.games && this.state.games.length > 0 > 0 ?
                                                                    this.state.games.map((item, i) => {
                                                                        return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                                    })
                                                                : ''
                                                                }
                                                            </select>
                                                        </label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Name :</label>
                                                        <input type="text" className="form-control" name="name" onChange={this.handleModal}/>
                                                    </div>
                                                    <div className="form-group">
                                                    { this.state.newValues ?
                                                        <Datatable 
                                                            multiSelectOption={false}
                                                            myData={this.state.newValues} 
                                                            editable={true}
                                                            pageSize={5}
                                                            pagination={true}
                                                            deletable={true}
                                                            handlerEditRow={this.handleEditRowModal}
                                                            handleDeleteRow={this.handleDeleteRowModal}
                                                            class="-striped -highlight"
                                                        />  : ''}
                                                    </div>
                                                </form>
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
                                    <div id="basicScenario" className="product-physical">
                                        {this.state.isLoding ?
                                            <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                                            :
                                            this.state.customizes && this.state.customizes.length > 0 ?
                                                <Datatable
                                                    multiSelectOption={false}
                                                    myData={this.state.customizes} 
                                                    editable={true}
                                                    pageSize={4}
                                                    pagination={true}
                                                    handlerEditRow={this.handlerEditRow}
                                                    handleDeleteRow={this.handleDeleteRow}
                                                    deletable={true}
                                                    class="-striped -highlight" 
                                                    isExpandable={true}
                                                    subitems={['name','factor']}
                                                    subData={'value'}
                                                    isConfirm={true}
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

export default Customizes

