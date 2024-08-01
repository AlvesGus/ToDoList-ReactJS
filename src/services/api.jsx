import axios from "axios";

export const api = axios.create({
  baseURL: 'https://todolist-nodejs-d8a7.onrender.com'
})