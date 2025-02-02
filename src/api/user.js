import { axiosWithAuth, basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FAKE_BASE_URL =
  "https://6734b250a042ab85d11b42b1.mockapi.io/api/swasthya/";

async function getAppointments() {
  return await basicAxios.get(`${FAKE_BASE_URL}appointments`);
}

async function getDoctors() {
  return await basicAxios.get(`${FAKE_BASE_URL}Doctors`);
}

async function getPatients() {
  return await axiosWithAuth.get(`${BASE_URL}patients`);
}
async function getMe() {
  return await axiosWithAuth.get(`${BASE_URL}me`);
}

export { getMe };

export { getPatients };

export { getDoctors };

export { getAppointments };
