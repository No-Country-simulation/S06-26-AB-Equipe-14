package Jar.mapper;

import Jar.dto.UserTableDTO.RegisterRequestDTO;
import Jar.dto.UserTableDTO.UserResponseDTO;
import Jar.model.User;

public class UserMapper {

    public static UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        return new UserResponseDTO(user.getPkUser(), user.getEmail(), user.getName());
    }

    public static User toEntity(RegisterRequestDTO dto) {
        if (dto == null) return null;
        User user = new User();
        user.setEmail(dto.email());
        user.setPassword(dto.password()); // Lembrar de criptografar no Service!
        user.setName(dto.name());
        return user;
    }
}
