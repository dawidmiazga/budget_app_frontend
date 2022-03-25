import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class LoginDataService {
    retrieveAllLogins() {
        return axios.get(`${JPA_API_URL}/users/userslist`);
    }
    retrieveLogin(id) {
        return axios.get(`${JPA_API_URL}/users/userslist/${id}`);
    }
    deleteLogin(id) {
        return axios.delete(`${JPA_API_URL}/users/userslist/${id}`);
    }
    updateLogin(id, login) {
        return axios.put(`${JPA_API_URL}/users/userslist/${id}`, login);
    }
    createLogin(login) {
        return axios.post(`${JPA_API_URL}/users/userslist`, login);
    }
}

export default new LoginDataService
