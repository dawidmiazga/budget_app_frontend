import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class CategoryDataService {
    retrieveAllCategories(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/categories`);
    }
    retrieveCategory(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/categories/${id}`);
    }
    deleteCategory(name, id) {
        return axios.delete(`${JPA_API_URL}/users/${name}/categories/${id}`);
    }
    updateCategory(name, id, category) {
        return axios.put(`${JPA_API_URL}/users/${name}/categories/${id}`, category);
    }
    createCategory(name, category) {
        return axios.post(`${JPA_API_URL}/users/${name}/categories`, category);
    }
}

export default new CategoryDataService
