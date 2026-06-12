package Jar.dto;
import java.util.Objects;


public class UserTableDTO {

    private Long pkUser;
    private String email;
    private String password;
    private String name;


    public UserTableDTO() {
    }

    public UserTableDTO(Long pkUser, String email, String password, String name) {
        this.pkUser = pkUser;
        this.email = email;
        this.password = password;
        this.name = name;
    }

    public Long getPkUser() {
        return this.pkUser;
    }

    public void setPkUser(Long pkUser) {
        this.pkUser = pkUser;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserTableDTO pkUser(Long pkUser) {
        setPkUser(pkUser);
        return this;
    }

    public UserTableDTO email(String email) {
        setEmail(email);
        return this;
    }

    public UserTableDTO password(String password) {
        setPassword(password);
        return this;
    }

    public UserTableDTO name(String name) {
        setName(name);
        return this;
    }


    public record UserResponseDTO(Long id, String email, String name) {}
    public record RegisterRequestDTO(String email, String password, String name) {}
}
