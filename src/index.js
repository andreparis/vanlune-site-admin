import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './index.scss';
import App from './components/app';
import { ScrollContext } from 'react-router-scroll-4';

// Components
import Dashboard from './components/dashboard';

// Products physical
import Category from './components/products/category';
import Customizes from './components/products/customizes';
import Product_list from './components/products/product-list';
import Add_product from './components/products/add-product';

//Orders
import Orders from './components/sales/orders'
import MyOrders from './components/sales/myorders'

import List_user from './components/users/list-user'

import Login from './components/auth/login';
import { isValid } from './services/auth';
import { ROLES } from './constants/roles';

const PrivateRoute = ({ component: Component, role, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isValid(role) ? (
            <Component {...props} />
            ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            )
        }
    />
);

class Root extends Component {
    render() {
        return (
            <BrowserRouter basename={'/'}>
                <ScrollContext>
                    <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
                        <Route exact path={`${process.env.PUBLIC_URL}/auth/login`} component={Login} />

                        <App>
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} />
                                
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/customizes`} role={ROLES['products/customize']} component={Customizes} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/category`} role={ROLES['products/category']} component={Category} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/product-list`} role={ROLES['products/get']} component={Product_list} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/products/add-product/:id`} role={ROLES['products']} component={Add_product} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/sales/orders`}  role={ROLES['orders/filters']} component={Orders} />
                            <PrivateRoute path={`${process.env.PUBLIC_URL}/sales/myorders`} role={ROLES['orders/filters']} component={MyOrders} />

                            <PrivateRoute path={`${process.env.PUBLIC_URL}/users/list-user`} role={ROLES['accounts/filters']} component={List_user} />

                        </App>
                    </Switch>
                </ScrollContext>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


