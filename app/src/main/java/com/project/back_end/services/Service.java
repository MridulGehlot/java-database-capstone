package com.project.back_end.services;

import com.project.back_end.dto.Login;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private PatientRepository patientRepository;

    public ResponseEntity<Map<String, String>> validateAdmin(Admin admin) {
        Map<String, String> response = new HashMap<>();

        Optional<Admin> existingAdminOpt = adminRepository.findByUsername(admin.getUsername());

        if (existingAdminOpt.isEmpty()) {
            response.put("message", "Admin not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Admin existingAdmin = existingAdminOpt.get();

        if (!existingAdmin.getPassword().equals(admin.getPassword())) {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = tokenService.generateToken(existingAdmin.getUsername());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    public boolean validateToken(String token, String user) {
        return tokenService.validateToken(token, user);
    }

    public int validateAppointment(Appointment appointment) {
        if (appointment == null || appointment.getDoctor() == null || appointment.getPatient() == null
                || appointment.getAppointmentTime() == null) {
            return 0;
        }
        return 1;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        Optional<Patient> patientOpt = patientRepository.findByEmail(login.getIdentifier());

        if (patientOpt.isEmpty()) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Patient patient = patientOpt.get();
        if (!patient.getPassword().equals(login.getPassword())) {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = tokenService.generateToken(patient.getEmail());
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    public Map<String, Object> filterDoctor(String name, String time, String specialty) {
        boolean hasName = name != null && !name.equalsIgnoreCase("null") && !name.isBlank();
        boolean hasTime = time != null && !time.equalsIgnoreCase("null") && !time.isBlank();
        boolean hasSpecialty = specialty != null && !specialty.equalsIgnoreCase("null") && !specialty.isBlank();

        if (hasName && hasTime && hasSpecialty) {
            return doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
        }
        if (hasName && hasTime) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        }
        if (hasName && hasSpecialty) {
            return doctorService.filterDoctorByNameAndSpecialty(name, specialty);
        }
        if (hasSpecialty && hasTime) {
            return doctorService.filterDoctorBySpecialtyAndTime(specialty, time);
        }
        if (hasSpecialty) {
            return doctorService.filterDoctorBySpecialty(specialty);
        }
        if (hasTime) {
            return doctorService.filterDoctorsByTime(time);
        }
        if (hasName) {
            return doctorService.findDoctorByName(name);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return response;
    }

    public Object filterPatient(String condition, String name, String token) {
        String email = tokenService.extractUsername(token);
        Optional<Patient> patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("appointments", java.util.Collections.emptyList());
            response.put("message", "Patient not found.");
            return response;
        }

        long patientId = patientOpt.get().getId();
        boolean hasCondition = condition != null && !condition.equalsIgnoreCase("null") && !condition.isBlank();
        boolean hasName = name != null && !name.equalsIgnoreCase("null") && !name.isBlank();

        if (hasCondition && hasName) {
            return patientService.filterByDoctorAndCondition(condition, name, patientId).getBody();
        }
        if (hasCondition) {
            return patientService.filterByCondition(condition, patientId).getBody();
        }
        if (hasName) {
            return patientService.filterByDoctor(name, patientId).getBody();
        }
        return patientService.getPatientAppointment(patientId, token).getBody();
    }
}