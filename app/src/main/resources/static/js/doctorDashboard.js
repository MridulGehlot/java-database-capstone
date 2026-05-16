import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

const patientTableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split("T")[0];
const token = localStorage.getItem("token");
let patientName = null;

document.getElementById("searchBar")?.addEventListener("input", (e) => {
    patientName = e.target.value.trim() || "null";
    loadAppointments();
});

document.getElementById("todayButton")?.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").value = selectedDate;
    loadAppointments();
});

document.getElementById("datePicker")?.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadAppointments();
});

async function loadAppointments() {
    try {
        const response = await getAllAppointments(
            selectedDate,
            patientName || "null",
            token
        );

        const appointments = response.appointments || [];

        patientTableBody.innerHTML = "";

        if (appointments.length === 0) {
            patientTableBody.innerHTML =
                `<tr><td colspan="5">No Appointments found for today.</td></tr>`;
            return;
        }

        appointments.forEach((appointment) => {
            const patient = {
                id: appointment.patient.id,
                name: appointment.patient.name,
                phone: appointment.patient.phone,
                email: appointment.patient.email
            };

            const row = createPatientRow(patient);
            patientTableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        patientTableBody.innerHTML =
            `<tr><td colspan="5">Error loading appointments. Try again later.</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    loadAppointments();
});