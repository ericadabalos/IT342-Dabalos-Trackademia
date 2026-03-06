package edu.cit.dabalos.trackademia.service;

import edu.cit.dabalos.trackademia.entity.User;
import edu.cit.dabalos.trackademia.repository.UserRepository;
import edu.cit.dabalos.trackademia.util.JwtUtil;
import edu.cit.dabalos.trackademia.dto.RegisterRequest;
import edu.cit.dabalos.trackademia.dto.LoginRequest;
import edu.cit.dabalos.trackademia.dto.AuthResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        AuthResponse response = new AuthResponse();
        response.setTimestamp(Instant.now().toString());

        // Validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Email is required");
            return response;
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Password must be at least 8 characters");
            return response;
        }
        if (request.getFirstname() == null || request.getFirstname().isEmpty()) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Firstname is required");
            return response;
        }
        if (request.getLastname() == null || request.getLastname().isEmpty()) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Lastname is required");
            return response;
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("BUSINESS-001"); // Assuming duplicate
            response.getError().setMessage("Email already exists");
            response.getError().setDetails(null);
            return response;
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole(User.Role.USER);

        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Response
        response.setSuccess(true);
        response.setData(new AuthResponse.AuthData());
        response.getData().setUser(new AuthResponse.UserInfo());
        response.getData().getUser().setEmail(user.getEmail());
        response.getData().getUser().setFirstname(user.getFirstname());
        response.getData().getUser().setLastname(user.getLastname());
        response.getData().setAccessToken(accessToken);
        response.getData().setRefreshToken(refreshToken);

        return response;
    }

    public AuthResponse login(LoginRequest request) {
        AuthResponse response = new AuthResponse();
        response.setTimestamp(Instant.now().toString());

        // Validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Email is required");
            return response;
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("VALID-001");
            response.getError().setMessage("Validation failed");
            response.getError().setDetails("Password is required");
            return response;
        }

        // Find user
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (!userOpt.isPresent() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            response.setSuccess(false);
            response.setError(new AuthResponse.ErrorDetails());
            response.getError().setCode("AUTH-001");
            response.getError().setMessage("Invalid credentials");
            response.getError().setDetails("Email or password is incorrect");
            return response;
        }

        User user = userOpt.get();

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Response
        response.setSuccess(true);
        response.setData(new AuthResponse.AuthData());
        response.getData().setUser(new AuthResponse.UserInfo());
        response.getData().getUser().setEmail(user.getEmail());
        response.getData().getUser().setFirstname(user.getFirstname());
        response.getData().getUser().setLastname(user.getLastname());
        response.getData().getUser().setRole(user.getRole().toString());
        response.getData().setAccessToken(accessToken);
        response.getData().setRefreshToken(refreshToken);

        return response;
    }
}