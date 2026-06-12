package Jar.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import Jar.dto.UserTableDTO.RegisterRequestDTO;
import Jar.dto.UserTableDTO.UserResponseDTO;
import Jar.mapper.UserMapper;
import Jar.model.User;
import Jar.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // Injeção via construtor (Melhor prática do Spring)
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserResponseDTO register(RegisterRequestDTO dto) {
      if(userRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        User user = UserMapper.toEntity(dto);
        // TODO: user.setPassword(passwordEncoder.encode(dto.password()));

        User savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        // Implement logic to find user by email here
        return userRepository.findByEmail(email);
    }   

}
