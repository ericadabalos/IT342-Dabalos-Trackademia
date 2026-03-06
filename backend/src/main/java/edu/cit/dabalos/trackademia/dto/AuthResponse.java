package edu.cit.dabalos.trackademia.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private boolean success;
    private AuthData data;
    private ErrorDetails error;
    private String timestamp;

    @Data
    public static class AuthData {
        private UserInfo user;
        private String accessToken;
        private String refreshToken;
    }

    @Data
    public static class UserInfo {
        private String email;
        private String firstname;
        private String lastname;
        private String role;
    }

    @Data
    public static class ErrorDetails {
        private String code;
        private String message;
        private Object details;
    }
}