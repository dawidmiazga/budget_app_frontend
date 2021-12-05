import axios from 'axios'
import { API_URL, JPA_API_URL } from '../../Constants'

class BudgetDataService {
    retrieveAllBudgets(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/budgets`);
    }

    retrieveBudget(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/budgets/${id}`);
    }

    deleteBudget(name, id) {
        return axios.delete(`${JPA_API_URL }/users/${name}/budgets/${id}`);
    }

    updateBudget(name, id, budget) {
        console.log(name + " " + id + " " + budget + " update")
        return axios.put(`${JPA_API_URL}/users/${name}/budgets/${id}`, budget);
    }

    createBudget(name, budget) {
        return axios.post(`${JPA_API_URL}/users/${name}/budgets`, budget);
    }
}


export default new BudgetDataService
