import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class ExpenseDataService {
    retrieveAllExpenses(usernameid) {
        console.log("11")
        return axios.get(`${JPA_API_URL}/users/${usernameid}/expenses`);
    }
    retrieveExpense(usernameid, expenseid) {
        console.log("22")
        return axios.get(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`);
    }
    deleteExpense(usernameid, expenseid) {
        console.log("33")
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`);
    }
    updateExpense(usernameid, expenseid, expense) {
        console.log("44")
        return axios.put(`${JPA_API_URL}/users/${usernameid}/expenses/${expenseid}`, expense);
    }
    createExpense(usernameid, expense) {
        console.log("55")
        return axios.post(`${JPA_API_URL}/users/${usernameid}/expenses`, expense);
    }
}

export default new ExpenseDataService
