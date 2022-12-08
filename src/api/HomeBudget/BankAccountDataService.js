import axios from 'axios'
import { JPA_API_URL } from '../../Constants'

class BankAccountDataService {
    retrieveAllBankAccounts(usernameid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/bankaccounts`);
    }
    retrieveBankAccount(usernameid, bankaccid) {
        return axios.get(`${JPA_API_URL}/users/${usernameid}/bankaccounts/${bankaccid}`);
    }
    deleteBankAccount(usernameid, bankaccid) {
        return axios.delete(`${JPA_API_URL}/users/${usernameid}/bankaccounts/${bankaccid}`);
    }
    updateBankAccount(usernameid, bankaccid, bankacc) {
        return axios.put(`${JPA_API_URL}/users/${usernameid}/bankaccounts/${bankaccid}`, bankacc);
    }
    createBankAccount(usernameid, bankacc) {
        return axios.post(`${JPA_API_URL}/users/${usernameid}/bankaccounts`, bankacc);
    }
}

export default new BankAccountDataService
