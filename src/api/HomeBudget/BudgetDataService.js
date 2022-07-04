import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class BudgetDataService {
    retrieveAllBudgets(usernameid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/budgets`);
    }
    retrieveBudget(usernameid, budgetid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/budgets/${budgetid}`);
    }
    deleteBudget(usernameid, budgetid) {
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/budgets/${budgetid}`);
    }
    updateBudget(usernameid, budgetid, budget) {
        return axios.put(`${JPA_API_URL}/users/${usernameid}/budgets/${budgetid}`, budget);
    }
    createBudget(usernameid, budget) {
        return axios.post(`${JPA_API_URL}/users/${usernameid}/budgets`, budget);
    }
}

export default new BudgetDataService
