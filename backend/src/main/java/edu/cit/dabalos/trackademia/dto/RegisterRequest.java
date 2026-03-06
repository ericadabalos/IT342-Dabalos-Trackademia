package edu.cit.dabalos.trackademia.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstname;
    private String lastname;
}