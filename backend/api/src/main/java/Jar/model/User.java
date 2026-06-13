package Jar.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "users")
public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_user")
    private Long id;
 
    @Column(name = "email", nullable = false, unique = true, length = 180)
    private String email;
 
    @Column(name = "name", nullable = false, length = 120)
    private String name;
 
    @Column(name = "role", length = 50)
    private String role = "VIEWER";
 
    @Column(name = "organisation", length = 200)
    private String organisation;
 
    @Column(name = "country", length = 60)
    private String country;
 
    @Column(name = "password", nullable = false, length = 255)
    private String password;
 
    @Column(name = "active")
    private Boolean active = true;
 
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
 
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
 
    // Getters e Setters
 
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
 
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
 
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
 
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
 
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
 