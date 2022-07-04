import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class CategoryDataService {
    retrieveAllCategories(usernameid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/categories`);
    }
    retrieveCategory(usernameid, categoryid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/categories/${categoryid}`);
    }
    deleteCategory(usernameid, categoryid) {
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/categories/${categoryid}`);
    }
    updateCategory(usernameid, categoryid, category) {
        return axios.put(`${JPA_API_URL}/users/${usernameid}/categories/${categoryid}`, category);
    }
    createCategory(usernameid, category) {
        return axios.post(`${JPA_API_URL}/users/${usernameid}/categories`, category);
    }
}

export default new CategoryDataService
