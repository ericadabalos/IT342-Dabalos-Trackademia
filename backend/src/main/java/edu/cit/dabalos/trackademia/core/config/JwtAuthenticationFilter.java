package edu.cit.dabalos.trackademia.core.config;

import edu.cit.dabalos.trackademia.core.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        // 1. Get the token from the request header
        final String authHeader = request.getHeader("Authorization");
        System.out.println("[DEBUG] JwtAuthFilter incoming: method=" + request.getMethod() + " uri=" + request.getRequestURI() + " AuthorizationPresent=" + (authHeader != null));
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Remove "Bearer "
            try {
                email = jwtUtil.getEmailFromToken(jwt);
                System.out.println("[DEBUG] JwtAuthFilter parsed email=" + email);
            } catch (Exception e) {
                System.out.println("[DEBUG] Token parsing failed: " + e.getMessage());
            }
        }

        // 2. If the token has an email, and the user isn't already logged into the Spring Context
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 3. Validate the token
            boolean valid = jwtUtil.validateToken(jwt);
            System.out.println("[DEBUG] JwtAuthFilter validateToken=" + valid + " for email=" + email);
            if (valid) {
                // 4. Create the authentication object and place it in the Spring Security Context
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email, null, new ArrayList<>()); //use email as the principal
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // This officially logs the user into the backend for this single request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continue the request
        filterChain.doFilter(request, response);
    }
}