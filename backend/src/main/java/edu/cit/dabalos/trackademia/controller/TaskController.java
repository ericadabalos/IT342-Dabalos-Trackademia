package edu.cit.dabalos.trackademia.controller;

import edu.cit.dabalos.trackademia.entity.Task; 
import edu.cit.dabalos.trackademia.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks(Principal principal) {
        return taskService.getAllTasks(principal.getName());
    }

    @GetMapping("/completed")
    public List<Task> getCompletedTasks(Principal principal) {
        return taskService.getCompletedTasks(principal.getName());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, Principal principal) {
        return taskService.createTask(task, principal.getName());
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id, Principal principal) {
        return taskService.completeTask(id, principal.getName());
    }

    @PutMapping("/{id}/request-hide")
    public Task requestHideTask(@PathVariable Long id, Principal principal) {
        return taskService.requestHideTask(id, principal.getName());
    }

    @GetMapping("/hide-requests")
    public List<Task> getHideRequests(Principal principal) {
        return taskService.getPendingHideRequests(principal.getName());
    }

    @PutMapping("/{id}/approve-hide")
    public Task approveHideRequest(@PathVariable Long id, @RequestBody(required = false) java.util.Map<String, String> payload, Principal principal) {
        String message = payload != null ? payload.get("message") : null;
        return taskService.approveHideRequest(id, principal.getName(), message);
    }

    @PutMapping("/{id}/deny-hide")
    public Task denyHideRequest(@PathVariable Long id, Principal principal) {
        return taskService.denyHideRequest(id, principal.getName());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask, Principal principal) {
        return taskService.updateTask(id, updatedTask, principal.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, Principal principal) {
        taskService.deleteTask(id, principal.getName());
    }
}
