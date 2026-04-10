package edu.cit.dabalos.trackademia.controller;

import edu.cit.dabalos.trackademia.entity.Task; 
import edu.cit.dabalos.trackademia.repository.TaskRepository;
import edu.cit.dabalos.trackademia.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ActivityService activityService;

    @GetMapping
    public List<Task> getAllTasks(Principal principal) {
        // Auto-complete any overdue tasks
        String userEmail = principal.getName();
        List<Task> allTasks = taskRepository.findByUserEmail(userEmail);
        
        LocalDate today = LocalDate.now();
        
        for (Task task : allTasks) {
            // Only check pending tasks
            if ("pending".equals(task.getStatus())) {
                try {
                    LocalDate deadlineDate = LocalDate.parse(task.getDeadline());
                    // If deadline is before today, auto-complete it
                    if (deadlineDate.isBefore(today)) {
                        task.setStatus("completed");
                        taskRepository.save(task);
                        activityService.logTaskAutoCompletion(userEmail, task.getTitle(), task.getId());
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing deadline for task: " + task.getId());
                }
            }
        }
        
        return taskRepository.findByUserEmail(userEmail);
    }

    @GetMapping("/completed")
    public List<Task> getCompletedTasks(Principal principal) {
        return taskRepository.findByUserEmailAndStatus(principal.getName(), "completed");
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, Principal principal) {
        if (task.getStatus() == null) {
            task.setStatus("pending");
        }
        
        task.setUserEmail(principal.getName()); 
        Task savedTask = taskRepository.save(task);
        
        // Log the activity
        activityService.logTaskCreation(principal.getName(), task.getTitle(), savedTask.getId());
        
        return savedTask;
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id, Principal principal) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        //Changed to "completed"
        task.setStatus("completed");
        Task completedTask = taskRepository.save(task);
        
        // Log the activity
        activityService.logTaskCompletion(principal.getName(), task.getTitle(), id);
        
        return completedTask;
    }

    //handles updating an existing task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask, Principal principal) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDeadline(updatedTask.getDeadline());
        task.setSubject(updatedTask.getSubject());
        task.setPriority(updatedTask.getPriority());
        
        Task savedTask = taskRepository.save(task);
        
        // Log the activity
        activityService.logTaskEdit(principal.getName(), task.getTitle(), id);
        
        return savedTask;
    }
}