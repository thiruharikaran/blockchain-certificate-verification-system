import api from "./axios";

let requestInterceptor;
let responseInterceptor;

export const setupInterceptors = (navigate) => {
  // Remove existing interceptors to prevent duplicates
  if (requestInterceptor) {
    api.interceptors.request.eject(
      requestInterceptor
    );
  }

  if (responseInterceptor) {
    api.interceptors.response.eject(
      responseInterceptor
    );
  }

  // Attach JWT token to outgoing requests
  requestInterceptor =
    api.interceptors.request.use(
      (config) => {
        const token =
          localStorage.getItem("token");

        if (token) {
          config.headers.Authorization =
            `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

  // Handle global API errors
  responseInterceptor =
    api.interceptors.response.use(
      (response) => response,

      (error) => {
        // Handle network connectivity failures
        if (error.code === "ERR_NETWORK") {
          navigate("/500");
          return Promise.reject(error);
        }

        const status =
          error.response?.status;

        switch (status) {
          case 401:
            // Clear authentication data and redirect
            localStorage.clear();
            navigate("/login");
            break;

          case 403:
            navigate("/403");
            break;

          case 404:
            navigate("/404");
            break;

          case 500:
            navigate("/500");
            break;

          default:
            break;
        }

        return Promise.reject(error);
      }
    );
};