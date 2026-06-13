package Jar.dto;

import java.time.LocalDateTime;
 
public class UserDTO {
 
    // --- Request (criação/actualização) ---
 
    public static class Request {
        private String email;
        private String name;
        private String role;
        private String organisation;
        private String country;
        private String password;
 
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
 
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
 
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
 
        public String getOrganisation() { return organisation; }
        public void setOrganisation(String organisation) { this.organisation = organisation; }
 
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
 
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
 
    // --- Response (exposição ao cliente — sem password) ---
 
    public static class Response {
        private Long id;
        private String email;
        private String name;
        private String role;
        private String organisation;
        private String country;
        private Boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
 
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
 
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
 
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
 
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
 
        public String getOrganisation() { return organisation; }
        public void setOrganisation(String organisation) { this.organisation = organisation; }
 
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
 
        public Boolean getActive() { return active; }
        public void setActive(Boolean active) { this.active = active; }
 
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
 
        public LocalDateTime getLastLogin() { return lastLogin; }
        public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    }
}