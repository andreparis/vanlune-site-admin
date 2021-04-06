import React, { Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from '../common/datatable';
import ReactLoading from 'react-loading';
import { createNewCategory, 
    getCategories,
    getGames,
    updateCategory,
    deleteCategory } from '../../services/products';

export class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            newCategory: {name: "", description: ""},
            selectedGame: 1,
            games: [],
            categories: [],
            isLoding: true
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
        this.getCategories();        
    }

    getAllGames = async () => {
        let games = await getGames();
        return games;
    }

    getCategories = async () => {
        let categories = await getCategories();
        this.state.categories = categories;
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
            let result = await createNewCategory({ 
                name: this.state.newCategory['name'],
                description: this.state.newCategory['description'],
                game: {id: this.state.selectedGame}
            });
            if (result == 0)
                alert("Category was not created!");
            else
                await this.getCategories();
        }
        else {
            this.state.newCategory = {};
        }
        this.state.open = false;
        this.setState(this.state);
    };

    handleGame = (event) => {
        this.state.selectedGame = event.target.value;
        this.setState(this.state);
    }

    handleModal = (event) => {
        console.log(event.target.value);
        this.state.newCategory[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handlerEditRow = async (row) => {
        this.state.isLoding = true;
        this.setState(this.state);

        let update = await updateCategory({
            id: row['id'],
            name: row['name'], 
            description: row['description'],
            game: {
                id: 1
            }});
        if (update == 1) {
            alert("Updated success!"); 
            this.getCategories();
        }
        else alert("Failed to update!");
    }

    handleDeleteRow = async (row) => {
        this.state.isLoding = true;
        this.setState(this.state);

        let deleteItem = await deleteCategory(row['id']);
        if (deleteItem == 1) {
            alert("Deleted success!"); 
            this.getCategories();
        }
        else alert("Failed to delete. Check if there is one or more product in this category!")
    }

    render() {
        const { open } = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Category" parent="Physical" />
                {/* <!-- Container-fluid starts--> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Category</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">

                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add Category</button>
                                        <Modal open={open} onClose={this.onCloseModal} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Category</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Game :</label>
                                                        <select className="custom-select" required="" name="games" onChange={this.handleGame}>
                                                            {this.state.games.length > 0 ?
                                                                this.state.games.map((item, i) => {
                                                                    return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                                })
                                                            : ''
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Category Name :</label>
                                                        <input type="text" className="form-control" name="name" onChange={this.handleModal}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Description :</label>
                                                        <input type="text" className="form-control" name="description" onChange={this.handleModal}/>
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
                                            this.state.categories && this.state.categories.length > 0 ?
                                                <Datatable
                                                    multiSelectOption={false}
                                                    myData={this.state.categories} 
                                                    editable={true}
                                                    pageSize={4}
                                                    pagination={true}
                                                    handlerEditRow={this.handlerEditRow}
                                                    handleDeleteRow={this.handleDeleteRow}
                                                    deletable={true}
                                                    class="-striped -highlight" 
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

export default Category

