import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class IncomeDataService {
    retrieveAllIncomes(usernameid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/incomes`);
    }
    retrieveIncome(usernameid, incomeid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`);
    }
    deleteIncome(usernameid, incomeid) {
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`);
    }
    updateIncome(usernameid, incomeid, income) {
        return axios.put(`${JPA_API_URL}/users/${usernameid}/incomes/${incomeid}`, income);
    }
    createIncome(usernameid, income) {
        return axios.post(`${JPA_API_URL}/users/${usernameid}/incomes`, income);
    }
}

export default new IncomeDataService
