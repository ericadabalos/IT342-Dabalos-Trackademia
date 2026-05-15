package com.example.trackademia.api

import com.google.gson.annotations.SerializedName

data class User(
    val id: Int,
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String
)

data class AuthData(
    val user: User,
    val accessToken: String
)

data class AuthResponse(
    val success: Boolean,
    val data: AuthData?,
    val error: ErrorDetail?
)

data class ErrorDetail(
    val message: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String,
    val role: String = "USER"
)

data class Task(
    val id: Int,
    val title: String,
    val description: String?,
    val deadline: String,
    val subject: String?,
    val priority: String,
    val status: String,
    val userId: Int
)

data class TaskRequest(
    val title: String,
    val description: String?,
    val deadline: String,
    val subject: String?,
    val priority: String
)

data class ActivityLog(
    val id: Int,
    val actionType: String,
    val description: String,
    val createdAt: String
)
