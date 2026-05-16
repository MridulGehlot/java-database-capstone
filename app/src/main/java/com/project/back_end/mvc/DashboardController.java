package com.project.back_end.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.AdminService;

@Controller
public class DashboardController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        Map<String, String> result = adminService.validateToken(token, "admin");

        if (result.isEmpty()) {
            return "admin/adminDashboard";
        }

        return "redirect:/";
    }

    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        Map<String, String> result = adminService.validateToken(token, "doctor");

        if (result.isEmpty()) {
            return "doctor/doctorDashboard";
        }

        return "redirect:/";
    }
}