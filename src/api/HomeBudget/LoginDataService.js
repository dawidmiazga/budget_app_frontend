import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class LoginDataService {
    retrieveAllLogins() {
        return axios.get(`${JPA_API_URL}/users/userslist`);
    }
    retrieveLogin(usernameid) {
        return axios.get(`${JPA_API_URL}/users/userslist/${usernameid}`);
    }
    deleteLogin(usernameid) {
        return axios.delete(`${JPA_API_URL}/users/userslist/${usernameid}`);
    }
    updateLogin(usernameid, login) {
        return axios.put(`${JPA_API_URL}/users/userslist/${usernameid}`, login);
    }
    createLogin(login) {
        return axios.post(`${JPA_API_URL}/users/userslist`, login);
    }

    // testretrieve(usernameid,yearnumber) {
    //     return axios.get(`${JPA_API_URL}/users/userslist/${usernameid}/year/${yearnumber}`);
    // }

}

export default new LoginDataService
