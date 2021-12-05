import axios from 'axios'
import { API_URL, JPA_API_URL } from '../../Constants'

class ExpenseDataService {
    retrieveAllExpenses(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/expenses`);
    }

    // ccccharts(name) {
    //     return axios.get(`${JPA_API_URL}/users/${name}/expenses/charts`);
    // }

    retrieveExpense(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/expenses/${id}`);
    }

    deleteExpense(name, id) {
        return axios.delete(`${JPA_API_URL }/users/${name}/expenses/${id}`);
    }

    updateExpense(name, id, expense) {
        console.log(name + " " + id + " " + expense + " update")
        return axios.put(`${JPA_API_URL}/users/${name}/expenses/${id}`, expense);
    }

    createExpense(name, expense) {
        return axios.post(`${JPA_API_URL}/users/${name}/expenses`, expense);
    }

// filterExpense(name, year) {
// return axios.get(`${JPA_API_URL}/users/${name}/expenses/date/${year}`);
// }
// commentExpense(name, comment) {
// return axios.get(`${JPA_API_URL}/users/${name}/expenses/comment/${comment}`);
// }
}


export default new ExpenseDataService
