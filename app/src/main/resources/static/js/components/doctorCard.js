import { overlay } from "../loggedPatient.js";
import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

export function createDoctorCard(doctor) {
    const card = document.createElement("div");
    card.className = "doctor-card";

    const role = localStorage.getItem("userRole");

    const doctorInfo = document.createElement("div");
    doctorInfo.className = "doctor-info";

    const name = document.createElement("h3");
    name.textContent = doctor.name;

    const specialty = document.createElement("p");
    specialty.textContent = `Specialty: ${doctor.specialty}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    const availableTimes = document.createElement("p");
    availableTimes.textContent = `Available: ${doctor.availableTimes?.join(", ") || ""}`;

    doctorInfo.appendChild(name);
    doctorInfo.appendChild(specialty);
    doctorInfo.appendChild(email);
    doctorInfo.appendChild(availableTimes);

    const actions = document.createElement("div");
    actions.className = "doctor-actions";

    // ADMIN
    if (role === "admin") {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "dashboard-btn";

        deleteBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            const result = await deleteDoctor(doctor.id, token);

            alert(result.message);

            if (result.success) {
                card.remove();
            }
        });

        actions.appendChild(deleteBtn);
    }

    // PATIENT NOT LOGGED IN
    else if (role === "patient") {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.className = "dashboard-btn";

        bookBtn.addEventListener("click", () => {
            alert("Please login before booking an appointment.");
        });

        actions.appendChild(bookBtn);
    }

    // LOGGED PATIENT
    else if (role === "loggedPatient") {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.className = "dashboard-btn";

        bookBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/";
                return;
            }

            const patient = await getPatientData(token);

            if (patient) {
                overlay(doctor, patient);
            }
        });

        actions.appendChild(bookBtn);
    }

    card.appendChild(doctorInfo);
    card.appendChild(actions);

    return card;
}