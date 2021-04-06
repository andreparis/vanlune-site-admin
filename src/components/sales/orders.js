import React, { Component, Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from '../common/datatable';
import ReactLoading from 'react-loading';
import { getUser } from '../../services/auth';
import { orderStatus } from '../../constants/orderStatus';
import { getCategoriesByGame, getGames } from '../../services/products';
import { getOrdersByFilter,
    assignOrders } from '../../services/orders';

export class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            order: [],
            games: [],
            categories: [],
            filter: {game:1},
            isLoding: false,
            isLoadingGames: true,
            isLoadingCategories: false
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
        this.getAllCategories(1);      
    }

    getAllGames = async () => {
        let games = await getGames();
        return games;
    }

    getAllCategories = async (game) => {
        this.state.isLoadingCategories = true;
        this.setState(this.state);
        let categories = await getCategoriesByGame({game: game});
        this.state.categories = categories;
        this.setState(this.state);
    }; 

    getOrder = async () => {
        console.log(this.state.filter);
        let orders = await getOrdersByFilter(this.state.filter);
        this.state.order = orders;
        this.state.isLoding = false;
        this.setState(this.state);
    }

    onOpenModal = () => {
        this.state.open = true;
        this.setState(this.state);
    };

    onCloseModal = async (action) => {
        this.state.open = false;
        this.setState(this.state);
    };

    handleFilter = async (event) => {
        console.log(event.target)
        if (event.target.name == 'game')
            await this.getAllCategories(event.target.value);
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
        await this.getOrder();
    }

    handleModal = (event) => {
        console.log(event.target.value);
    }

    handlerEditRows = async (row) => {
        this.state.isLoding = true;
        this.setState(this.state);
        let user = getUser();
        await assignOrders(user['id'], row);
        await this.getOrder();
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
                                    <div className="clearfix"></div>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">   
                                        <div className="form-control col-form-label-sm">    
                                        { this.state.isLoadingGames ?
                                            <ReactLoading type="balls" color="blue" height={50} width={50} /> 
                                            : 
                                            <div className="form-row col">  
                                                <label className="col-form-label">Order Number
                                                    <input className="form-control" id="validationCustom02" type="text" name="id" onChange={this.handleFilter}/> 
                                                </label> 
                                                <label className="col-form-label">Game
                                                    <select className="custom-select" required="" name="game" onChange={this.handleFilter}>
                                                        {this.state.games && this.state.games.length > 0 ?
                                                            this.state.games.map((item, i) => {
                                                                return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                            })
                                                        : ''
                                                        }
                                                    </select>
                                                </label>
                                                <label className="col-form-label">Category
                                                    <select className="custom-select" required="" name="category" onChange={this.handleFilter}>
                                                        <option value="">--Select--</option>
                                                        {this.state.categories && this.state.categories.length > 0 > 0 ?
                                                            this.state.categories.map((item, i) => {
                                                                return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                            })
                                                        : ''
                                                        }
                                                    </select>
                                                </label> 
                                                <label className="col-form-label">Status
                                                    <select className="custom-select" required="" name="status" onChange={this.handleFilter}>
                                                        <option value="">--Select--</option>
                                                        {orderStatus && orderStatus.length > 0 > 0 ?
                                                            orderStatus.map((item, i) => {
                                                                return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                            })
                                                        : ''
                                                        }
                                                    </select>
                                                </label>
                                                <label className="col-form-label">Atttendent's Email
                                                    <input className="form-control" id="validationCustom02" type="text" name="attendentEmail" onChange={this.handleFilter}/> 
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
                                    <h5>Orders</h5>
                                </div>
                                <div className="card-body">
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        {this.state.isLoding ?
                                            <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                                            :
                                            this.state.order && this.state.order.length > 0 ?
                                                <Datatable
                                                    multiSelectOption={false}
                                                    myData={this.state.order} 
                                                    editable={false}
                                                    multiSelectOption={true}
                                                    multiSelectColNames={["Sign"]}
                                                    multiSelectHandler={this.handlerEditRows}
                                                    pageSize={4}
                                                    pagination={true}
                                                    class="-striped -highlight" 
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

export default Orders

