import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Config } from "src/utils/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: (headers) => {
    const token = window.sessionStorage.getItem("access-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});

export const {} = api;
