package edu.cit.dabalos.trackademia.service;

import edu.cit.dabalos.trackademia.entity.Activity;
import edu.cit.dabalos.trackademia.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public Activity createActivity(String userEmail, String text, String type, String taskTitle, Long taskId) {
        Activity activity = new Activity(userEmail, text, type, taskTitle, taskId);
        return activityRepository.save(activity);
    }

    public List<Activity> getUserActivities(String userEmail) {
        return activityRepository.findByUserEmailOrderByTimestampDesc(userEmail);
    }

    public void logTaskCompletion(String userEmail, String taskTitle, Long taskId) {
        createActivity(userEmail, taskTitle + " marked as done", "complete", taskTitle, taskId);
    }

    public void logTaskAutoCompletion(String userEmail, String taskTitle, Long taskId) {
        createActivity(userEmail, taskTitle + " auto-closed (overdue)", "complete", taskTitle, taskId);
    }

    public void logTaskCreation(String userEmail, String taskTitle, Long taskId) {
        createActivity(userEmail, "New task added: " + taskTitle, "add", taskTitle, taskId);
    }

    public void logTaskEdit(String userEmail, String taskTitle, Long taskId) {
        createActivity(userEmail, "Edited: " + taskTitle, "add", taskTitle, taskId);
    }

    public void logTaskDeletion(String userEmail, String taskTitle) {
        createActivity(userEmail, "Deleted: " + taskTitle, "delete", taskTitle, null);
    }

    public void logLogin(String userEmail) {
        createActivity(userEmail, "Logged into Trackademia", "auth", null, null);
    }
}
