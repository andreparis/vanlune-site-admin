import api from './api';
import {URL} from '../constants/urls';

export const getOrdersByFilter = async (filters) => {
    try {
        var result = await api.get(URL.ORDERS_URL + '/filters', {params: filters});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const createOrders = async (order) => {
    try {
        var result = await api.post(URL.ORDERS_URL, {orders: [order]});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const updateOrders = async (orders) => {
    try {
        var result = await api.put(URL.ORDERS_URL, {orders: orders});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const assignOrders = async (user, orders) => {
    try {
        var result = await api.post(URL.ORDERS_URL+'/assign', {UserId: user, OrdersId: orders});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}