package com.example.trackademia.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @GET("tasks")
    suspend fun getTasks(): Response<List<Task>>

    @POST("tasks")
    suspend fun createTask(@Body task: TaskRequest): Response<Task>

    @PUT("tasks/{taskId}")
    suspend fun updateTask(@Path("taskId") taskId: Int, @Body task: TaskRequest): Response<Task>

    @PUT("tasks/{taskId}/complete")
    suspend fun completeTask(@Path("taskId") taskId: Int): Response<Task>

    @GET("activities")
    suspend fun getActivities(): Response<List<ActivityLog>>
}
