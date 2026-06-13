package Jar.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Jar.dto.UserDTO;
import Jar.mapper.UserMapper;
import Jar.model.User;
import Jar.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
 
@Service
@Transactional
public class UserService {
 
    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;
 
    public UserService(UserRepository repository, UserMapper mapper, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }
 
    // ── CREATE ────────────────────────────────────────────────────────────────
 
    public UserDTO.Response create(UserDTO.Request dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email já registado: " + dto.getEmail());
        }
 
        User user = mapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
 
        return mapper.toResponse(repository.save(user));
    }
 
    // ── READ ──────────────────────────────────────────────────────────────────
 
    @Transactional(readOnly = true)
    public List<UserDTO.Response> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
 
    @Transactional(readOnly = true)
    public UserDTO.Response findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado: " + id));
    }
 
    // ── UPDATE ────────────────────────────────────────────────────────────────
 
    public UserDTO.Response update(Long id, UserDTO.Request dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado: " + id));
 
        // Se o email mudou, verificar unicidade
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (repository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Email já em uso: " + dto.getEmail());
            }
        }
 
        mapper.updateEntity(user, dto);
 
        // Re-encriptar se a password veio preenchida
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
 
        return mapper.toResponse(repository.save(user));
    }
 
    // ── DELETE (soft delete) ──────────────────────────────────────────────────
 
    public void deactivate(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado: " + id));
        user.setActive(false);
        repository.save(user);
    }
 
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Utilizador não encontrado: " + id);
        }
        repository.deleteById(id);
    }
}