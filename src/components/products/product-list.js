import React, { Fragment, useState, useEffect } from 'react'
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import { fetchProductByFilters, 
    getCategoriesByGame,  
    getTags,
    getGames } from '../../services/products';
    

const Product_list = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [data, setData] = useState([]);
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(0);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [filter, setFilter] = useState({});
    useEffect(() => {
        getAllGames();
        getAllTags();
    }, []);

    useEffect(() => {
        if (selectedGame && selectedGame > 0)
            getAllCategories({game: selectedGame});

    },[selectedGame]);

    const getAllGames = async () => {
        let games = await getGames();
        setIsLoading(false);
        setGames(games);
    };

    const getAllCategories = async (game) => {
        let categories = await getCategoriesByGame(game);
        console.log(categories);
        setCategories(categories);
    };

    const getAllTags = async () => {
        let tags = await getTags();
        setTags(tags);
    }

    const Table = () => (
        <Datatable
            multiSelectOption={false}
            myData={data}
            pageSize={9}
            pagination={false}
            class="-striped -highlight"
            editable={true}
            linkTo={rowMoveTo}
        />
    );

    const rowMoveTo = (prop) => (
        <Link to={"/products/add-product/"+prop.id} className="btn btn-secondary">EDIT</Link>
    );

    const handleSelectGame = event => {
        filter[event.target.name] = event.target.value;
        setFilter(filter);
        setSelectedGame(event.target.value);
    }

    const handleFilter = event => {
        filter[event.target.name] = event.target.value;
        setFilter(filter);
    }

    const handleSubmit = () => {
        setIsLoadingData(true);
        console.log(filter);
        fetchProductByFilters(filter)
        .then(result => {
            console.log(result);
            setIsLoadingData(false);
            if (result && result.length > 0)
                setData(result);
        });        
    }

    return (
        <Fragment>
            <Breadcrumb title="Products List" parent="Products" />
            {/* <!-- Container-fluid starts--> */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Filters</h5>
                            </div>
                            <div className="card-body">
                                {isLoading ? 
                                <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                                : <>
                                <div className="clearfix"></div>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">   
                                        <div className="form-control col-form-label-sm">     
                                         <div className="form-row col">                                
                                            <label className="col-form-label">Game
                                                <select className="custom-select" required="" name="game" onChange={handleSelectGame}>
                                                    <option value="">--Select--</option>
                                                    {games && games.length > 0 > 0 ?
                                                        games.map((item, i) => {
                                                            return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                        })
                                                    : ''
                                                    }
                                                </select>
                                            </label>
                                            <label className="col-form-label">Title
                                                <input className="form-control" id="validationCustom02" type="text" name="title" onChange={handleFilter}/> 
                                            </label>   
                                        </div>
                                        <div className="form-row col">                                       
                                            <label className="col-form-label">Category
                                                <select className="custom-select" required="" name="category" onChange={handleFilter}>
                                                    <option value="">--Select--</option>
                                                    {categories && categories.length > 0 > 0 ?
                                                        categories.map((item, i) => {
                                                            return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                        })
                                                    : ''
                                                    }
                                                </select>
                                            </label>
                                            <label className="col-form-label">Tag
                                                <select className="custom-select" required="" name="tagName" onChange={handleFilter}>
                                                    <option value="">--Select--</option>
                                                    {tags && tags.length > 0 ?
                                                        tags.map((item, i) => {
                                                            return  <option key={i} value={item['id']}>{item['Name']}</option>                                                    
                                                        })
                                                    : ''
                                                    }
                                                </select>
                                            </label>
                                        </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" aria-posinset="center" type="submit" onClick={handleSubmit}>Filter</button>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Product Lists</h5>
                            </div>
                            <div className="card-body">
                                <div className="clearfix"></div>
                                <div id="basicScenario" className="product-physical">
                                    {isLoadingData ? 
                                    <ReactLoading type="balls" color="blue" height={500} width={50} /> :
                                    data && data.length == 0 ? 
                                    '' :
                                    <Table />}
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

export default Product_list
