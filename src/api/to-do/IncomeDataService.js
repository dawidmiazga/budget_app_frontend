import axios from 'axios'
import { API_URL, JPA_API_URL } from '../../Constants'

class IncomeDataService {
    retrieveAllIncomes(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/incomes`);
    }

    ccccharts(name) {
        return axios.get(`${JPA_API_URL}/users/${name}/income/charts`);
    }

    retrieveIncome(name, id) {
        return axios.get(`${JPA_API_URL}/users/${name}/incomes/${id}`);
    }

    deleteIncome(name, id) {
        return axios.delete(`${JPA_API_URL }/users/${name}/incomes/${id}`);
    }

    updateIncome(name, id, income) {
        return axios.put(`${JPA_API_URL}/users/${name}/incomes/${id}`, income);
    }

    createIncome(name, income) {
        return axios.post(`${JPA_API_URL}/users/${name}/incomes`, income);
    }
}

export default new IncomeDataService
