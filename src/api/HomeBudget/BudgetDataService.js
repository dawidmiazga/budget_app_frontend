import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class BudgetDataService {
    retrieveAllBudgets(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/budgets`);
    }
    retrieveBudget(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/budgets/${id}`);
    }
    deleteBudget(name, id) {
        return axios.delete(`${JPA_API_URL}/users/${name}/budgets/${id}`);
    }
    updateBudget(name, id, budget) {
        return axios.put(`${JPA_API_URL}/users/${name}/budgets/${id}`, budget);
    }
    createBudget(name, budget) {
        return axios.post(`${JPA_API_URL}/users/${name}/budgets`, budget);
    }
}

export default new BudgetDataService
