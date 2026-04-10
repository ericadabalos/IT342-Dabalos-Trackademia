package edu.cit.dabalos.trackademia.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String text;
    private String type;
    private LocalDateTime timestamp;
    private String taskTitle;
    private Long taskId;

    public Activity() {
    }

    public Activity(String userEmail, String text, String type, String taskTitle, Long taskId) {
        this.userEmail = userEmail;
        this.text = text;
        this.type = type;
        this.taskTitle = taskTitle;
        this.taskId = taskId;
        this.timestamp = LocalDateTime.now();
    }
}
