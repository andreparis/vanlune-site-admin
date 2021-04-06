import api from './api';
import {URL} from '../constants/urls';

export const getUsersByFilter = async (filters) => {
    try {
        var result = await api.get(URL.ACCOUNT_URL + '/filters', {params: filters});
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const getRoles = async () => {
    try {
        var result = await api.get(URL.ACCOUNT_URL + '/roles');
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}

export const addUserToRoles = async (payload) => {
    try {
        var result = await api.post(URL.ACCOUNT_URL + '/roles/patch',payload);
        if (result.status == 200)
            return result.data.Content; 
    } 
    catch (err) {
        console.log(err);
    }
    return [];
}