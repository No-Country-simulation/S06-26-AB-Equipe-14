package Jar.service;

import java.util.Optional;

import Jar.dto.UserTableDTO.RegisterRequestDTO;
import Jar.dto.UserTableDTO.UserResponseDTO;
import Jar.model.User;

public interface UserService {

    UserResponseDTO register(RegisterRequestDTO dto);
    Optional<User> findByEmail(String email);
}
