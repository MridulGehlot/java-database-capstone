import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    const addBtn = document.getElementById("addDocBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => openModal("addDoctor"));
    }
});

async function loadDoctorCards() {
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Failed to load doctors:", error);
    }
}

document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    try {
        const searchBar = document.getElementById("searchBar").value.trim();
        const filterTime = document.getElementById("filterTime").value;
        const filterSpecialty = document.getElementById("filterSpecialty").value;

        const name = searchBar.length > 0 ? searchBar : null;
        const time = filterTime.length > 0 ? filterTime : null;
        const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

        const response = await filterDoctors(name, time, specialty);
        const doctors = response.doctors;

        if (doctors.length > 0) {
            renderDoctorCards(doctors);
        } else {
            document.getElementById("content").innerHTML =
                "<p>No doctors found with the given filters.</p>";
        }
    } catch (error) {
        console.error(error);
        alert("Error filtering doctors");
    }
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    doctors.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

window.adminAddDoctor = async function () {
    const name = document.getElementById("doctorName").value;
    const email = document.getElementById("doctorEmail").value;
    const phone = document.getElementById("doctorPhone").value;
    const password = document.getElementById("doctorPassword").value;
    const specialty = document.getElementById("specialization").value;

    const availableTimes = Array.from(
        document.querySelectorAll('input[name="availability"]:checked')
    ).map((checkbox) => checkbox.value);

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Unauthorized access");
        return;
    }

    const doctor = {
        name,
        email,
        phone,
        password,
        specialty,
        availableTimes
    };

    const result = await saveDoctor(doctor, token);

    if (result.success) {
        alert(result.message);
        document.getElementById("modal").style.display = "none";
        window.location.reload();
    } else {
        alert(result.message);
    }
};