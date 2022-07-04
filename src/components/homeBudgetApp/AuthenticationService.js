import axios from 'axios'
import { API_URL } from '../../Constants'

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'autenticatedUser'
// export const USER_NAME_SESSION_ATTRIBUTE_NAME2 = 'autenticatedUser'

class AuthenticationService {

    // executeBasicAuthenticationService(username, password) {
    //     return axios.get(`${API_URL}/basicauth`,
    //         { headers: { authorization: this.createBasicAuthToken(username, password) } })

    // }

    // executeJwtAuthenticationService(username, password) {
    //     return axios.get(`${API_URL}/authenticate`, {
    //         username,
    //         password
    //     })

    // }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ':' + password)
    }

    registerSuccessfulLogin(username, password, usernameid) {
        // sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, usernameid);
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    // registerSuccessfulLoginForJwt(username,token){
    //     sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    //     this.setupAxiosInterceptors(this.createJWTToken(token))

    // }

    // createJWTToken(token) {
    //     return 'Bearer ' + token
    // }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user == null  || (user == "" && window.location.href === "http://localhost:4200/login")) return false;
        return true;

    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return '';
        return user;
    }

    setupAxiosInterceptors(basicAuthHeader) {

        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = basicAuthHeader
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()
