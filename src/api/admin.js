import { axiosWithAuth } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function showSpecialities() {
  return await axiosWithAuth.get(`${BASE_URL}admin/speciality`);
}
async function showDoctors() {
    return await axiosWithAuth.get(`${BASE_URL}admin/doctor`);
}

async function addSpeciality(speciality) {
    return await axiosWithAuth.post(`${BASE_URL}admin/speciality`, speciality);
}
async function updateSpeciality({ id, name, status }) {
    return await axiosWithAuth.put(`${BASE_URL}admin/speciality/${id}`, { name, status });
}
export { updateSpeciality };

export { addSpeciality };

export { showSpecialities };
export { showDoctors };