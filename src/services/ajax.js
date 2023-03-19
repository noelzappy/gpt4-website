import axios from "axios";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, body, params, headers = {} }) => {
    console.log(method.toUpperCase(), url, body || {});

    const token = window.sessionStorage.getItem("access-token");

    try {
      const options = {
        url: baseUrl + url,
        method,
        data: body,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "application/json",
          ...headers,
        },
      };
      if (params) {
        options.params = params;
      }

      const result = await axios(options);
      return { data: result.data };
    } catch (axiosError) {
      console.log(axiosError, axiosError.response.data);
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export { axiosBaseQuery };
