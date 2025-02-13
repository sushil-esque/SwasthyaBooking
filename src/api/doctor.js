import { axiosWithAuth } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getDoctorAppointments() {
  return await axiosWithAuth.get(`${BASE_URL}doctor/appointment`);
}
async function updateAppointment(data) {
  return await axiosWithAuth.put(`${BASE_URL}doctor/appointment/${data.id}`, {
    doctor_id: data.doctor_id,
    date: data.date,
    time: data.time,
    status: data.status,
  });

}

async function getDoctorMe() {
  return await axiosWithAuth.get(`${BASE_URL}doctor/me`);
}

async function updateDoctorProfile() {
  return await axiosWithAuth.post(`${BASE_URL}doctor/updataProfile`);

}
export {updateDoctorProfile}

export { getDoctorMe };

export { updateAppointment };


export { getDoctorAppointments };
