import React, { Component,Fragment } from 'react';
import { Multiselect } from "multiselect-react-dropdown";
import Breadcrumb from '../common/breadcrumb';
import Datatable from '../common/datatable';
import MyUploader from '../common/dropzone';
import MyModal from '../common/modal';
import CurrencyInput from 'react-currency-input-field'
import ReactLoading from 'react-loading';
import Modal from 'react-responsive-modal';
import { convertToBase64 } from '../../Util/convert';
import { createOrUpdateProduct, 
    fetchProductByFilters, 
    getCategoriesByGame, 
    getCustomizes, 
    getVariants, 
    getTags,
    uploadImage,
    getGames,
    createNewCategory } from '../../services/products'

export class Add_product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            games: [{id: 1, name: 'World of Warcraft'}],
            variantsEdited: [],
            categories: [],
            customizes: [],
            variantsServer: [],
            tags: [],
            allFiles: Array(File),
            isLoadingPicture: false,
            isLoadingProduct: true,
            isLoadingServers: true,
            isLoadingCustomizes: true,
            isLoadingCategories: true,
            isLoadingTags: true,
            isLoadingGames: true,
            product: { 
                game: {id: 1},
                title:"",
                description:"",
                price:0,
                quantity:1,
                sale:false,
                category:{},
                variants:[],
                images:[{image:{}}], 
                image:{src:""}, 
                tags:[],
                customizes: []
            },
        };
        this.fetchProduct()
        .then(() => {   
            this.state.isLoadingProduct = false;
            this.setState(this.state);
        });
        this.getTags()
        .then(() => {   
            this.state.isLoadingTags = false;
            this.setState(this.state);
        });
        this.getAllGames()
        .then(() => {
            this.getAllByGames(this.state.games[0]['id']);
        });
    }

    fetchProduct = async () => {
        const { id } = this.props.match.params
        if (id != undefined) {
            let product = await fetchProductByFilters({id, game:1});
            if (product &&
                product.length > 0) {
                this.state.product = product[0];
                this.setState(this.state);
            }            
        }        
    };

    getAllGames = async () => {
        let games = await getGames();
        if (games && games.length > 0) {
            this.state.games = games;
            this.state.isLoadingGames = false;
            this.setState(this.state);
        }
    }

    getAllByGames = (game) => {
        this.getCategories(game)
        .then(() => {   
            this.state.isLoadingCategories = false;
            this.setState(this.state);
        });
        this.getCustomizes(game)
        .then(() => {   
            this.state.isLoadingCustomizes = false;
            this.setState(this.state);
        });
        this.getVariantsServer(game)
        .then(() => {   
            this.state.isLoadingServers = false;
            this.setState(this.state);
        });
    }

    getCategories = async (game) => {
        let categories = await getCategoriesByGame({game: game});
        this.state.categories = categories;
        this.setState(this.state);
    };

    getCustomizes = async (game) => {
        let customizes = await getCustomizes({game});
        this.state.customizes = customizes;
        this.setState(this.state);
    }

    getVariantsServer = async (game) => {
        let variantsServer = await getVariants(game);
        this.state.variantsServer = variantsServer;
        this.setState(this.state);
    }

    getTags = async () => {
        let tags = await getTags();
        for(var i=0; i< tags.length; i++) {
            if (tags[i]['Name'] != undefined)
                this.state.tags.push(tags[i]['Name']);
        }
        this.setState(this.state);
    }

    getCustomizesNotSelected = () => {
        let customizes = [];
        for (var i = 0; i < this.state.customizes.length; i ++) {
            let customize = this.state.customizes[i];
            for (let j = 0; j < this.state.product['customizes']; j++) {            
                let product = this.state.product['customizes'][j];
                if (product['id'] != customize['id']) customizes.push(product);
            }
        }
        
        return customizes;
    }

    getTagsNotSelecteds = () => {
        let tags = [];
        for (var i = 0; i < this.state.tags.length; i ++) {
            let tag = this.state.tags[i]['Name'];
            if (this.state.product == undefined || 
                !this.state.product['tags'].includes(tag))
                tags.push(tag);
        }    
        return tags;
    }

    isCustomizedInProduct = (customize) => {
        for (let j = 0; j < this.state.product['customizes']; j++) {            
            let product = this.state.product['customizes'][j];
            if (product['id'] == customize['id']) return true;
        }
        return false;
    }

    onOpenModal = () => {
        this.state.open = true;
        this.setState(this.state);
    };

    onCloseModal = async (action) => {
        if (action == "save") {
            let result = await createNewCategory(this.state.product['game']['id'], 
            this.state.newCategory['name'],
            this.state.newCategory['description']);
            if (result == 0)
                alert("Category was not created!");
            else
                await this.getCategories(this.state.product['game']['id']);
        }
        else {
            this.state.newCategory = {};
        }
        this.state.open = false;
        this.setState(this.state);
    };

    handleModalCategory = (event) => {
        this.state.newCategory[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handleGamesChange = (event) => {
        let gameId = event.target.value;
        this.state.product['game'] = {id:gameId};
        this.setState(this.state);
        this.getAllByGames(gameId);
    }

    handleEvent = (event) => {
        this.state.product[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handlePrice = (event) => {        
        this.state.product[event.target.value] = event.target.name.replace('.', '');
        this.setState(this.state);
    }

    handleCheckboxChange = event => {
        this.state.product[event.target.name] = event.target.checked;
        this.setState(this.state);
    }

    handleCategoryChange = event => {
        let category = {};
        for (var i = 0; i < this.state.categories.length; i ++) {
            if (this.state.categories[i]['id'] == event.target.value) {
                category = this.state.categories[i];
                break;
            }
        }
        this.state.product[event.target.name] = category;
        this.setState(this.state);
    }

    handlerEditRow = (edited) => {
        let contains = false;
        for (var i = 0; i < this.state.product['variants'].length; i++) {
            let variants = this.state.product['variants'][i];
            if (variants['id'] == edited['id']) {
                this.state.product['variants'][i] = edited;
                contains = true;
                break;
            }                
        }
        if (contains && edited['id'] > 0)
            this.state.product['variants'].push(edited);
        
        console.log(this.state.product['variants']);

        this.setState(this.state);
    }

    handlerPictureUpload = (files, allFiles) => {
        console.log(files.map(f => f.meta))
        allFiles.forEach(f => f.remove())
    }

    handleChangeStatus = ({ meta, file }, status, allFiles) => 
    { 
        if (String(status) == 'preparing') {
            this.state.isLoadingPicture = true;
            this.setState(this.state);
            for(var i = 0; i < allFiles.length - 1; i++) {
                allFiles[i].remove();
            }
        }
        else if (String(status) == 'done')
        {
            this.state.isLoadingPicture = false;

            if (!allFiles[0].file.name.includes(".png"))
            {
                alert("format must be PNG!");
                for(var i = 0; i < allFiles.length - 1; i++) {
                    allFiles[i].remove();
                }
            }
            else
                this.state.allFiles = allFiles;

            this.setState(this.state);
        }
        console.log(status, meta, file) 
        console.log(allFiles);
    }

    onSelectTabs = (selectedList, selectedItem) => {
        if (this.state.product['tags'] == undefined)
            this.state.product['tags'] = [];
        if (!this.state.product['tags'].includes(selectedItem))
            this.state.product['tags'].push(selectedItem);
        this.state.tags.filter(item => item !== selectedItem);
        this.setState(this.state);
        console.log(selectedList);
    }

    onRemoveTabs = (selectedList, removedItem) => {
        this.state.product['tags'].filter(item => item !== removedItem);
        if (!this.state.tags.includes(removedItem))
            this.state.tags.push(removedItem);
        this.setState(this.state);
        console.log(selectedList);
    }

    onSelectCustomizes = (selectedList, selectedItem) => {
        if (this.state.product['customizes'] == undefined) 
            this.state.product['customizes'] = [];
        if (!this.state.product['customizes'].includes(selectedItem))
            this.state.product['customizes'].push(selectedItem);
        this.state.customizes.filter(item => item['name'] != selectedItem['name']);
        this.setState(this.state);
    }

    onRemoveCustomizes = (selectedList, removedItem) => {
        this.state.product['customizes'].filter(item => item['name'] != removedItem['name']);
        if (!this.state.customizes.includes(removedItem))
            this.state.customizes.push(removedItem);
        this.setState(this.state);
    }

    onSubmit = async () => {
        console.log(this.state.product);
        if (
        this.state.product['game']['id'] <= 0 ||
        this.state.product['title']==''       ||
        this.state.product['description']=='' ||
        this.state.product['category']=={}    ||
        this.state.product['price'] == 0      ||
        this.state.product['quantity']== 0
        ) {
            alert("You must fill all *'s fields!");
            return;
        }
        const file = this.state.allFiles[0];        
        if (this.state.allFiles[0].file != undefined) {
            var fileBase64 = await convertToBase64(file);
            var body = {
                fileName: this.state.allFiles[0].file.name,
                file: fileBase64.replace('data:image/png;base64,','')                   
            };
            var urlImg = await uploadImage(body);
            this.state.product.images[0].image = { src: urlImg };
        }
        if (String(this.state.product['price']).includes(','))
            this.state.product['price'] = this.state.product['price'].replace(',','.')
        this.state.product['image'] = this.state.product.images[0].image;
        var result = await createOrUpdateProduct({product: this.state.product});
        if (result)
            alert("created/updated!");
        else
            alert("not created!");
    }

    render() {
        return (
            <Fragment>
                {this.state.isLoadingProduct ? 
                <ReactLoading type="balls" color="blue" height={500} width={50} /> 
                : <>
                <Breadcrumb title="Add Products" parent="Digital" />
                <div className="container-fluid">
                    <div className="row product-adding">
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>General</h5>
                                </div>
                                <div className="card-body">
                                    <div className="digital-add needs-validation">
                                    <div className="form-group">
                                            {this.state.isLoadingGames ? 
                                            <ReactLoading type="balls" color="blue" height={25} width={25} /> 
                                            : <>
                                            <label className="col-form-label"><span>*</span> Game</label>
                                            <select className="custom-select" required="" name="games" onChange={this.handleGamesChange}>
                                                {this.state.product && this.state.product['games'] ?
                                                    <option value="">{this.state.product['games']['name']}</option>
                                                    : ''
                                                }
                                                {this.state.games.length > 0 ?
                                                this.state.games.map((item, i) => {
                                                    if (this.state.product && 
                                                        this.state.product['games'] &&
                                                        item['name'] == this.state.product['games']['name'])
                                                        return '';
                                                    return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                })
                                                : ''
                                                }
                                            </select>
                                            </>}
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label pt-0"><span>*</span> Title</label>
                                            {this.state.product && this.state.product['title'] ? 
                                            <input className="form-control" defaultValue={this.state.product['title']} id="validationCustom01" type="text" required="" name="title" onChange={this.handleEvent}/> : 
                                            <input className="form-control" id="validationCustom01" type="text" required="" name="title" onChange={this.handleEvent}/>                                             
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label pt-0"><span>*</span> Description</label>
                                            {this.state.product && this.state.product['description'] ? 
                                            <input className="form-control" defaultValue={this.state.product['description']} id="validationCustom02" type="text" required="" name="description" onChange={this.handleEvent}/> : 
                                            <input className="form-control" id="validationCustom02" type="text" required="" name="description" onChange={this.handleEvent}/>                                             
                                            }
                                        </div>
                                        <div className="form-group">
                                            {this.state.isLoadingCategories ? 
                                            <ReactLoading type="balls" color="blue" height={25} width={25} /> 
                                            : <>
                                            <label className="col-form-label"><span>*</span> Categories</label>
                                            <select className="custom-select" required="" name="category" onChange={this.handleCategoryChange}>
                                                {this.state.product && this.state.product['category'] ?
                                                <option value="">{this.state.product['category']['name']}</option>:
                                                <option value="">--Select--</option>
                                                }
                                                {this.state.categories.length > 0 ?
                                                this.state.categories.map((item, i) => {
                                                    if (this.state.product && 
                                                        this.state.product['category'] &&
                                                        item['name'] == this.state.product['category']['name'])
                                                        return '';
                                                    return  <option key={i} value={item['id']}>{item['name']}</option>                                                    
                                                })
                                                : ''
                                                }
                                            </select>
                                            </>}
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label"><span>*</span> Product Price</label>
                                            {this.state.product && this.state.product['price'] ? 
                                            <CurrencyInput className="form-control" allowNegativeValue={false} prefix="R$" decimalSeparator="," groupSeparator="." value={String(this.state.product['price']).replace('.',',')} decimalsLimit={2} id="validationCustom03" required="" name="price" onValueChange={(name, value) => this.handlePrice({target:{name,value}})}/> : 
                                            <CurrencyInput className="form-control" allowNegativeValue={false} prefix="R$" decimalSeparator="," groupSeparator="." id="validationCustom03" decimalsLimit={2} placeholder="Please enter a number" required="" name="price" onValueChange={(name, value) => this.handlePrice({target:{name,value}})}/>                                
                                            }
                                            
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label"><span>*</span> Quantity </label>
                                            {this.state.product && this.state.product['quantity'] ? 
                                            <input className="form-control" defaultValue={this.state.product['quantity']} id="validationCustom04" type="text" required="" name="quantity" onChange={this.handleEvent}/> : 
                                            <input className="form-control" id="validationCustom04" type="text" required="" name="quantity" onChange={this.handleEvent}/>                                
                                            }
                                            
                                        </div>
                                        <div className="form-group">
                                            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                <label className="d-block">
                                                    { this.state.product && this.state.product['sale'] == 'true' ? 
                                                    <input className="radio_animated" id="edo-ani" type="checkbox" name="rdo-ani" checked={true} name="sale" onChange={this.handleCheckboxChange}/>:
                                                    <input className="radio_animated" id="edo-ani" type="checkbox" name="rdo-ani"  name="sale" onChange={this.handleCheckboxChange}/>
                                                    }
                                                    Sale
                                                </label>
                                            </div>
                                        </div>
                                        <label className="col-form-label pt-0"> Picture Upload</label> 
                                        {this.state.isLoadingPicture ? <ReactLoading type="spin" color="blue" height={50} width={50} /> : '' }
                                        <MyUploader onSubmit={this.onSubmit} handleChangeStatus={this.handleChangeStatus}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Server's Variants</h5>
                                </div>
                                <div className="card-body">
                                    <div className="digital-add needs-validation">
                                        <div className="form-group mb-0">
                                            <div className="description-sm">
                                                {this.state.isLoadingServers ? 
                                                <ReactLoading type="balls" color="blue" height={25} width={25} />  
                                                :
                                                this.state.product && 
                                                this.state.product['variants'].length > 0 ? 
                                                    <Datatable
                                                        multiSelectOption={false}
                                                        myData={this.state.product['variants']}
                                                        editable={true}
                                                        pageSize={4}
                                                        pagination={true}
                                                        handlerEditRow={this.handlerEditRow}
                                                        deletable={false}
                                                        class="-striped -highlight"/> 
                                                    :
                                                    this.state.variantsServer.length > 0 ?
                                                    <Datatable
                                                        multiSelectOption={false}
                                                        myData={this.state.variantsServer}
                                                        editable={true}
                                                        pageSize={4}
                                                        pagination={true}
                                                        handlerEditRow={this.handlerEditRow}
                                                        deletable={false}
                                                        class="-striped -highlight"/>  
                                                    : ''
                                                }                                        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Customizes</h5>
                                </div>
                                <div className="card-body">
                                    {this.state.isLoadingCustomizes ? 
                                    <ReactLoading type="balls" color="blue" height={25} width={25} />  
                                    :
                                    <div className="digital-add needs-validation">
                                            <Multiselect
                                                options={this.state.customizes}
                                                selectedValues={this.state.product['customizes']}
                                                displayValue="name"
                                                onSelect={this.onSelectCustomizes}
                                                onRemove={this.onRemoveCustomizes}
                                            /> 
                                    </div>}
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Tags</h5>
                                </div>
                                <div className="card-body">
                                    {this.state.isLoadingTags ? 
                                    <ReactLoading type="balls" color="blue" height={25} width={25} />  
                                    :
                                    <div className="digital-add needs-validation">
                                        <Multiselect
                                            options={this.state.tags}
                                            selectedValues={this.state.product['tags']}
                                            isObject={false}
                                            onSelect={this.onSelectTabs}
                                            onRemove={this.onRemoveTabs}
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button href="javascript:void(0)" className="btn btn-primary" aria-posinset="center" onClick={this.onSubmit}>Save</button>
                    </div>
                </div> 
                
                </>
            }
            </Fragment>
        )
    }
}

export default Add_product
