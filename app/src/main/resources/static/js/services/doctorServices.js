import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

export async function getDoctors() {
    try {
        const response = await fetch(DOCTOR_API);
        const data = await response.json();
        return data.doctors;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}

export async function deleteDoctor(id, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
            method: "DELETE"
        });

        const data = await response.json();

        return {
            success: response.ok,
            message: data.message
        };
    } catch (error) {
        console.error("Delete doctor error:", error);
        return {
            success: false,
            message: "Failed to delete doctor"
        };
    }
}

export async function saveDoctor(doctor, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doctor)
        });

        const data = await response.json();

        return {
            success: response.ok,
            message: data.message
        };
    } catch (error) {
        console.error("Save doctor error:", error);
        return {
            success: false,
            message: "Failed to save doctor"
        };
    }
}

export async function filterDoctors(name, time, specialty) {
    try {
        const response = await fetch(
            `${DOCTOR_API}/filter/${name}/${time}/${specialty}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch doctors");
            return { doctors: [] };
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
        return { doctors: [] };
    }
}