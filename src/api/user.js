import { axiosWithAuth, basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FAKE_BASE_URL =
  "https://6734b250a042ab85d11b42b1.mockapi.io/api/swasthya/";


  async function userLogin() {
    return await basicAxios.post(`${BASE_URL}login`);
  }

async function getAppointments() {
  return await axiosWithAuth.get(`${BASE_URL}user/appointment`);
}
async function acceptAppointments() {
  return await axiosWithAuth.patch(`${FAKE_BASE_URL}appointments`);
}

async function getDoctors() {
  return await basicAxios.get(`${FAKE_BASE_URL}Doctors`);
}

async function getPatients() {
  return await axiosWithAuth.get(`${BASE_URL}admin/customer`);
}

async function addFavorite(id) {
  return await axiosWithAuth.post(`${BASE_URL}user/favorites/${id}`);
}
async function bookAppointment(data) {
  return await axiosWithAuth.post(`${BASE_URL}user/appointment`, data);
}

async function getFavorites() {
  return await axiosWithAuth.get(`${BASE_URL}user/favorites`);
}

async function deleteFavorite(id) {
  return await axiosWithAuth.delete(`${BASE_URL}user/favorites/${id}`);
}


export { deleteFavorite };

export {getFavorites};

export { bookAppointment };

export { addFavorite };

export { userLogin };


export { getPatients };

export { getDoctors };

export { getAppointments };

export { acceptAppointments };
