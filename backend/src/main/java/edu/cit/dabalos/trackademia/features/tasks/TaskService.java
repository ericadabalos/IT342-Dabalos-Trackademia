package edu.cit.dabalos.trackademia.features.tasks;

import edu.cit.dabalos.trackademia.features.tasks.Task;import edu.cit.dabalos.trackademia.features.auth.User;
import edu.cit.dabalos.trackademia.features.auth.UserRepository;
import edu.cit.dabalos.trackademia.features.activity.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    private void verifyAdmin(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        if (user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Admin access required");
        }
    }

    /**
     * Get all tasks for a user, with auto-completion of overdue tasks
     * ACID: Atomicity - Either all overdue tasks are updated or none are
     */
    @Transactional
    public List<Task> getAllTasks(String userEmail) {
        List<Task> allTasks = taskRepository.findByUserEmailAndHiddenFalse(userEmail);
        LocalDate today = LocalDate.now();

        for (Task task : allTasks) {
            if ("pending".equals(task.getStatus())) {
                try {
                    LocalDate deadlineDate = LocalDate.parse(task.getDeadline());
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

        return taskRepository.findByUserEmailAndHiddenFalse(userEmail);
    }

    /**
     * Get all completed tasks for a user
     */
    @Transactional(readOnly = true)
    public List<Task> getCompletedTasks(String userEmail) {
        return taskRepository.findByUserEmailAndStatusAndHiddenFalse(userEmail, "completed");
    }

    /**
     * Create a new task and log the activity
     * ACID: Atomicity - Task creation and activity logging are atomic
     * If activity logging fails, entire transaction rolls back
     */
    @Transactional
    public Task createTask(Task task, String userEmail) {
        if (task.getStatus() == null) {
            task.setStatus("pending");
        }

        task.setUserEmail(userEmail);
        Task savedTask = taskRepository.save(task);

        // Log the activity as part of the same transaction
        activityService.logTaskCreation(userEmail, task.getTitle(), savedTask.getId());

        return savedTask;
    }

    /**
     * Complete a task and log the activity
     * ACID: Atomicity - Task status change and activity logging are atomic
     * If activity logging fails, status change is rolled back
     */
    @Transactional
    public Task completeTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus("completed");
        Task completedTask = taskRepository.save(task);

        // Log the activity as part of the same transaction
        activityService.logTaskCompletion(userEmail, task.getTitle(), taskId);

        return completedTask;
    }

    @Transactional
    public Task requestHideTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (!userEmail.equals(task.getUserEmail())) {
            throw new RuntimeException("Unauthorized hide request");
        }

        task.setHideRequested(true);
        task.setHideRequestedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        System.out.println("[DEBUG] requestHideTask: user=" + userEmail + " taskId=" + taskId + " hideRequested=" + saved.isHideRequested());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Task> getPendingHideRequests(String adminEmail) {
        verifyAdmin(adminEmail);
        List<Task> list = taskRepository.findByHideRequestedTrueOrderByHideRequestedAtDesc();
        System.out.println("[DEBUG] getPendingHideRequests: admin=" + adminEmail + " count=" + (list == null ? 0 : list.size()));
        return list;
    }

    @Transactional
    public Task approveHideRequest(Long taskId, String adminEmail, String message) {
        verifyAdmin(adminEmail);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        task.setHideRequested(false);
        task.setHidden(true);
        Task saved = taskRepository.save(task);

        // Log an admin audit activity
        activityService.logHideRequestApproval(adminEmail, task.getTitle(), taskId);

        // Notify the task owner that their hide request was approved, include admin message if provided
        String note = "Your hide request for: " + task.getTitle() + " was approved.";
        if (message != null && !message.trim().isEmpty()) {
            note = note + " Message from admin: " + message.trim();
        }
        activityService.createActivity(task.getUserEmail(), note, "notification", task.getTitle(), taskId);

        return saved;
    }

    @Transactional
    public Task denyHideRequest(Long taskId, String adminEmail) {
        verifyAdmin(adminEmail);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        task.setHideRequested(false);
        Task saved = taskRepository.save(task);

        // Log an admin audit activity
        activityService.logHideRequestDenial(adminEmail, task.getTitle(), taskId);
        // Notify the task owner that their hide request was denied
        activityService.createActivity(task.getUserEmail(), "Your hide request for: " + task.getTitle() + " was denied", "notification", task.getTitle(), taskId);

        return saved;
    }

    /**
     * Update an existing task and log the activity
     * ACID: Atomicity - Task update and activity logging are atomic
     * If activity logging fails, task update is rolled back
     */
    @Transactional
    public Task updateTask(Long taskId, Task updatedTask, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDeadline(updatedTask.getDeadline());
        task.setSubject(updatedTask.getSubject());
        task.setPriority(updatedTask.getPriority());

        Task savedTask = taskRepository.save(task);

        // Log the activity as part of the same transaction
        activityService.logTaskEdit(userEmail, task.getTitle(), taskId);

        return savedTask;
    }

    /**
     * Delete a task and log the activity
     * ACID: Atomicity - Task deletion and activity logging are atomic
     * If activity logging fails, deletion is rolled back
     */
    @Transactional
    public void deleteTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        // Log the activity before deletion
        activityService.logTaskDeletion(userEmail, task.getTitle());

        // Delete as part of the same transaction
        taskRepository.deleteById(taskId);
    }
}
