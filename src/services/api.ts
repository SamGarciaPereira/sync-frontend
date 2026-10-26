import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  // Sends the session cookie (login) on every request to the API.
  withCredentials: true,
});
