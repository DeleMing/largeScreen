import axios from 'axios';
let base = "/api"
if (process.env.NODE_ENV == "production") {
    base = config.webServer;
}
export default {
    post(url, params) {
        return axios.post(base + url, params);
    },
    get(url) {
        return axios.get(base + url);
    }
} 