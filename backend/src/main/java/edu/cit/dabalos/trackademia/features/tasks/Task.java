package edu.cit.dabalos.trackademia.features.tasks;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String deadline;
    private String subject;
    private String priority;
    private String status;
    private String userEmail;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean hideRequested = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean hidden = false;

    private LocalDateTime hideRequestedAt;
}

