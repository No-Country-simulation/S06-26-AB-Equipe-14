package Jar.mapper;



import org.springframework.stereotype.Component;

import Jar.dto.UserDTO;
import Jar.model.User;
 
@Component
public class UserMapper {
 
    /** Entity → Response DTO */
    public UserDTO.Response toResponse(User user) {
        if (user == null) return null;
 
        UserDTO.Response dto = new UserDTO.Response();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setOrganisation(user.getOrganisation());
        dto.setCountry(user.getCountry());
        dto.setActive(user.getActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        return dto;
    }
 
    /** Request DTO → Entity (novo registo) */
    public User toEntity(UserDTO.Request dto) {
        if (dto == null) return null;
 
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setRole(dto.getRole() != null ? dto.getRole() : "VIEWER");
        user.setOrganisation(dto.getOrganisation());
        user.setCountry(dto.getCountry());
        // A password deve ser encriptada no Service antes de persistir
        user.setPassword(dto.getPassword());
        return user;
    }
 
    /** Actualiza uma entidade existente com dados do Request DTO */
    public void updateEntity(User user, UserDTO.Request dto) {
        if (dto.getName() != null)         user.setName(dto.getName());
        if (dto.getEmail() != null)        user.setEmail(dto.getEmail());
        if (dto.getRole() != null)         user.setRole(dto.getRole());
        if (dto.getOrganisation() != null) user.setOrganisation(dto.getOrganisation());
        if (dto.getCountry() != null)      user.setCountry(dto.getCountry());
        // Password só é actualizada se vier preenchida
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(dto.getPassword()); // encriptar no Service
        }
    }
}