package edu.cit.dabalos.trackademia.controller;

import edu.cit.dabalos.trackademia.entity.Activity;
import edu.cit.dabalos.trackademia.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping
    public List<Activity> getUserActivities(Principal principal) {
        return activityService.getUserActivities(principal.getName());
    }
}
