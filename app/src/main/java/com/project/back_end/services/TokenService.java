package com.project.back_end.services;


import com.project.back_end.models.Admin;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
public class TokenService {

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Value("${jwt.secret}")
    private String secret;

    public TokenService(AdminRepository adminRepository,
                        DoctorRepository doctorRepository,
                        PatientRepository patientRepository) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public String generateToken(String identifier) {
        return Jwts.builder()
                .setSubject(identifier)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000))
                .signWith(getSigningKey())
                .compact();
    }

public String extractIdentifier(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return claims.getSubject();
}

    public boolean validateToken(String token, String user) {
        try {
            String identifier = extractIdentifier(token);

            if ("admin".equalsIgnoreCase(user)) {
                Optional<Admin> admin = adminRepository.findByUsername(identifier);
                return admin.isPresent();
            }

            if ("doctor".equalsIgnoreCase(user)) {
                Optional<Doctor> doctor = doctorRepository.findByEmail(identifier);
                return doctor.isPresent();
            }

            if ("patient".equalsIgnoreCase(user)) {
                Optional<Patient> patient = patientRepository.findByEmail(identifier);
                return patient.isPresent();
            }

            return false;

        } catch (Exception e) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
public String extractUsername(String token) {
    return extractClaims(token).getSubject();
}
public String generateToken(String username, String role) {
    return generateToken(username);

}
public Claims extractClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
}