// const SELF_ROUTE = "http://localhost:3000";
const SELF_ROUTE = "https://qrappaiedge.netlify.app";

// const BASE_API_URL = "http://localhost:8000/";
const BASE_API_URL = "https://qrappbackend.herokuapp.com/";

function BackendApi(endpoint) {
    return BASE_API_URL + endpoint
}

function BackendAccountApi(endpoint) {
    return BackendApi(`account/${endpoint}`)
}

function BackendVehicleApi(endpoint) {
    return BackendApi(`vehicle/${endpoint}`)
}

function BackendRideApi(endpoint) {
    return BackendApi(`ride/${endpoint}`)
}

export { BackendAccountApi };
export { BackendApi };
export { BackendVehicleApi };
export { BackendRideApi };

export { SELF_ROUTE };