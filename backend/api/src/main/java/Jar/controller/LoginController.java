package Jar.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import Jar.dto.LoginRequest;
import Jar.dto.LoginResponse;
import Jar.dto.UserDTO;
import Jar.mapper.UserMapper;
import Jar.model.User;
import Jar.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class LoginController {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public LoginController(UserRepository repository, UserMapper mapper, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = repository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "E-mail ou senha incorretos."));
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Conta desactivada. Contacte o administrador."));
        }

        user.setLastLogin(LocalDateTime.now());
        repository.save(user);

        UserDTO.Response userResponse = mapper.toResponse(user);
        String token = "placeholder-token-" + user.getId();

        return ResponseEntity.ok(new LoginResponse(token, userResponse));
    }
}