package Jar.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Jar.dto.UserDTO;
import Jar.service.UserService;

import java.util.List;
 
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Ajustar para o domínio do Next.js em produção
public class UserController {
 
    private final UserService service;
 
    public UserController(UserService service) {
        this.service = service;
    }
 
    // POST /api/users
    @PostMapping
    public ResponseEntity<UserDTO.Response> create(@RequestBody UserDTO.Request dto) {
        UserDTO.Response created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
 
    // GET /api/users
    @GetMapping
    public ResponseEntity<List<UserDTO.Response>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
 
    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO.Response> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
 
    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO.Response> update(
            @PathVariable Long id,
            @RequestBody UserDTO.Request dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
 
    // PATCH /api/users/{id}/deactivate  — soft delete
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }
 
    // DELETE /api/users/{id}  — hard delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}