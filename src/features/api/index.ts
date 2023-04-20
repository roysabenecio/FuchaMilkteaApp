import axios from "axios";

export const BASE_URL = 'https://localhost:7280'; // local SQL Server Connection
// export const BASE_URL = 'https://fuchawebapp.azurewebsites.net'; // Azure Connection

export const ENDPOINTS = {
    Users: {
        GetAllUsers: 'Users/GetAllUsers',
        RegisterUser: 'Users/RegisterUser'
    }   
};

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
        get: () => axios.get(url),
        getById: id => axios.get(url + id),
        post: newRecord => axios.get(url, newRecord),
    };
};