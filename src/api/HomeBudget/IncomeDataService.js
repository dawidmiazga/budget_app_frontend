import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class IncomeDataService {
    retrieveAllIncomes(usernameid) {
        console.log("1")
        return axios.get(`${JPA_API_URL}/users/${usernameid}/incomes`);
    }
    retrieveIncome(usernameid, incomeid) {
        console.log("2")
        return axios.get(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`);
    }
    deleteIncome(usernameid, incomeid) {
        console.log("3")
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`);
    }
    updateIncome(usernameid, incomeid, income) {
        console.log("4")
        return axios.put(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`, income);
    }
    createIncome(usernameid, income) {
        console.log("5")
        return axios.post(`${JPA_API_URL}/users/${usernameid}/incomes`, income);
    }
}

export default new IncomeDataService
