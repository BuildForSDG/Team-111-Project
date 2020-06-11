import axios from "axios";
import settings from "../settings";


const doPost = async (path, data) => {
    let response = {};
    try {
        await axios({
            method: 'POST',
            url: `${settings.BACKEND_BASE_URL}/${path}`,
            data: data
        }).then((res) => {
            response.results = res.data;
            response.reqStatus = res.status
        });
    } catch (error) {
        if (!error.response) {
            response.reqStatus = "500";
            response.message = "internal server error"
        } else {
            console.log(error.response)
            response.reqStatus = error.response.status
            for (const message in error.response.data) {
                // noinspection JSUnfilteredForInLoop
                response.message = error.response.data[message][0];

            }
        }
    }
    return response;
}
const doGet = async (path) => {
    let response = {};
    const token = localStorage.getItem("token");
    try {
        await axios({
            method: 'GET',
            url: `${settings.BACKEND_BASE_URL}/${path}`,
            headers: { "authorization": token}
            // headers
        }).then((res) => {
            console.log(res);
            console.log(res.data)

            /// hurry hurry toupdate thiswhen calme
            if (res.data.results){
                response.results = res.data.results;
            }
            else {
                response.results = res.data
            }
            response.reqStatus = res.status
        });
    } catch (error) {
        if (!error.response) {
            response.reqStatus = "500";
            response.message = "internal server error"
            response.results = [];
        } else {
            console.log(error.response)
            response.reqStatus = error.response.status
            for (const message in error.response.data) {
                // noinspection JSUnfilteredForInLoop
                response.message = error.response.data[message][0];
                response.results = [];

            }
        }
    }
    return response;
}

export {doPost, doGet}


