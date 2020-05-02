import api from "../utils/api";

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    api.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete api.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;