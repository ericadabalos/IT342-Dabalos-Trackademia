package edu.cit.dabalos.trackademia.controller;

import edu.cit.dabalos.trackademia.entity.Task; 
import edu.cit.dabalos.trackademia.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks(Principal principal) {
        return taskRepository.findByUserEmail(principal.getName());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, Principal principal) {
        if (task.getStatus() == null) {
            task.setStatus("pending");
        }
        
        task.setUserEmail(principal.getName()); 
        
        return taskRepository.save(task);
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        //Changed to "completed"
        task.setStatus("completed");
        return taskRepository.save(task);
    }

    //handles updating an existing task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDeadline(updatedTask.getDeadline());
        task.setSubject(updatedTask.getSubject());
        task.setPriority(updatedTask.getPriority());
        
        return taskRepository.save(task);
    }
}