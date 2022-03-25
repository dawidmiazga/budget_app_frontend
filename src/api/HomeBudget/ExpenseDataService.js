import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class ExpenseDataService {
    retrieveAllExpenses(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/expenses`);
    }
    retrieveExpense(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/expenses/${id}`);
    }
    deleteExpense(name, id) {
        return axios.delete(`${JPA_API_URL}/users/${name}/expenses/${id}`);
    }
    updateExpense(name, id, expense) {
        return axios.put(`${JPA_API_URL}/users/${name}/expenses/${id}`, expense);
    }
    createExpense(name, expense) {
        return axios.post(`${JPA_API_URL}/users/${name}/expenses`, expense);
    }
}

export default new ExpenseDataService
