import { axiosWithAuth } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


async function getDoctorAppointments() {
  return await axiosWithAuth.get(`${BASE_URL}doctor/appointment`);
};
export { getDoctorAppointments };
