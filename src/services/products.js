import api from './api';
import {URL} from '../constants/urls';

export const createOrUpdateProduct = async (payload) => {
    try {
        var result = await api.post(URL.PRODUCTS_URL, payload);
        if (result.status == 200)
            return true; 
    } 
    catch (err) {
        console.log(err);
    }
    return false;
}

export const fetchProductByFilters = async (filters) => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/filters', {params: filters});
        console.log(result.data.Content);
        if (result.status == 200)
            return result.data.Content; 
    }
    catch (err) {
        console.log(err);
    }    
    return [];
}

export const getCategories = async () => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/category/all');
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const getCategoriesByGame = async (game) => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/category/game', {params: game});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const createNewCategory = async (category) => {
    try {
        var result = await api.post(URL.PRODUCTS_URL+'/category', {category: category});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const updateCategory = async (category) => {
    try {
        var result = await api.put(URL.PRODUCTS_URL+'/category', {category: category});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const deleteCategory = async (idCategory) => {
    try {
        var result = await api.delete(URL.PRODUCTS_URL+'/category', {params:{id:idCategory}});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const getCustomizes = async (filters) => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/customize/filters', {params: filters});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const getVariants = async (game) => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/variants/servers', {params: {game}});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const getTags = async () => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/tags');
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const getGames = async () => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/games/all');
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const uploadImage = async (body) => {
    try {
        var result = await api.post(URL.PRODUCTS_URL + '/upload', body);
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return false;
}

export const getCustomizeByFilter = async (filters) => {
    try {
        var result = await api.get(URL.PRODUCTS_URL + '/customize/filters', {params: filters});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const createNewCustomize = async (customizes) => {
    try {
        var result = await api.post(URL.PRODUCTS_URL+'/customize', {customizes: customizes});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const updateCustomizes = async (customizes) => {
    try {
        var result = await api.put(URL.PRODUCTS_URL+'/customize', {customizes: customizes});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}

export const deleteCustomizes = async (ids) => {
    try {
        var result = await api.delete(URL.PRODUCTS_URL+'/customize', {params:{id:ids}});
        console.log(result.data.Content);
        if (result.status == 200)
            return 1; 
    }
    catch (err) {
        console.log(err);
    }    
    return 0;
}
