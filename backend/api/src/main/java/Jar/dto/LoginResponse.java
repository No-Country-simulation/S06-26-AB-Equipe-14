package Jar.dto;


public class LoginResponse {
    private String token;
    private UserDTO.Response user;
 
    public LoginResponse(String token, UserDTO.Response user) {
        this.token = token;
        this.user = user;
    }
 
    public String getToken() { return token; }
    public UserDTO.Response getUser() { return user; }
}