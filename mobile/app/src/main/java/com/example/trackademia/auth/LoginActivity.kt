package com.example.trackademia.auth

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.trackademia.api.ApiClient
import com.example.trackademia.api.LoginRequest
import com.example.trackademia.databinding.ActivityLoginBinding
import com.example.trackademia.main.MainActivity
import com.google.gson.Gson
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check if already logged in
        val sharedPrefs = getSharedPreferences("TrackademiaPrefs", Context.MODE_PRIVATE)
        if (sharedPrefs.getString("token", null) != null) {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        binding.tvSignUp.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                showError("Please enter email and password")
                return@setOnClickListener
            }

            binding.btnLogin.isEnabled = false
            binding.tvError.visibility = View.GONE

            lifecycleScope.launch {
                try {
                    val api = ApiClient.getClient(this@LoginActivity)
                    val response = api.login(LoginRequest(email, password))
                    
                    if (response.isSuccessful) {
                        val authResponse = response.body()
                        if (authResponse?.success == true && authResponse.data != null) {
                            val token = authResponse.data.accessToken
                            val userJson = Gson().toJson(authResponse.data.user)
                            
                            sharedPrefs.edit()
                                .putString("token", token)
                                .putString("user", userJson)
                                .apply()
                                
                            startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                            finish()
                        } else {
                            showError(authResponse?.error?.message ?: "Login failed")
                        }
                    } else {
                        showError("Login failed: ${response.code()}")
                    }
                } catch (e: Exception) {
                    showError("Network error: ${e.message}")
                } finally {
                    binding.btnLogin.isEnabled = true
                }
            }
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }
}
