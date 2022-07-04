import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class ExpenseDataService {
    retrieveAllExpenses(usernameid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/expenses`);
    }
    retrieveExpense(usernameid, expenseid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`);
    }
    deleteExpense(usernameid, expenseid) {
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`);
    }
    updateExpense(usernameid, expenseid, expense) {
        return axios.put(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`, expense);
    }
    createExpense(usernameid, expense) {
        return axios.post(`${JPA_API_URL}/users/${usernameid}/expenses`, expense);
    }
}

export default new ExpenseDataService
