package edu.cit.dabalos.trackademia;

import edu.cit.dabalos.trackademia.entity.User;
import edu.cit.dabalos.trackademia.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedAdmin(UserRepository userRepository) {
		return args -> {
			String adminEmail = "admin@gmail.com";
			String adminPassword = "Admin1234";
			if (!userRepository.existsByEmail(adminEmail)) {
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				User admin = new User();
				admin.setEmail(adminEmail);
				admin.setPassword(encoder.encode(adminPassword));
				admin.setFirstname("Admin");
				admin.setLastname("User");
				admin.setRole(User.Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Seeded default admin user: " + adminEmail);
			}
		};
	}

}
