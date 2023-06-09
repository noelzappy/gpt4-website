import { createApi } from "@reduxjs/toolkit/query/react";
import { Config } from "src/utils/constants";
import { axiosBaseQuery } from "./ajax";

// const baseQuery = fetchBaseQuery({
//   baseUrl: Config.API_URL,
//   prepareHeaders: (headers) => {
//     const token = window.sessionStorage.getItem("access-token");
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     headers.set("Accept", "application/json");
//     headers.set("Content-Type", "application/json");

//     return headers;
//   },
// });

const baseQuery = axiosBaseQuery({ baseUrl: Config.API_URL });

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQuery,
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getChats: builder.query({
      query: () => ({
        url: "/chats",
        method: "GET",
      }),
    }),

    getChat: builder.query({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "GET",
      }),
    }),

    createChat: builder.mutation({
      query: (body) => ({
        url: "/chats",
        method: "POST",
        body,
      }),
    }),

    getMessages: builder.query({
      query: (id) => ({
        url: `/messages/?chat=${id}`,
        method: "GET",
      }),
    }),

    payment: builder.mutation({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetChatQuery,
  useGetChatsQuery,
  useUpdateProfileMutation,
  useCreateChatMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,

  useLazyGetChatsQuery,
  usePaymentMutation,
} = api;
