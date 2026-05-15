package com.example.trackademia.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.trackademia.api.ApiClient
import com.example.trackademia.api.RegisterRequest
import com.example.trackademia.databinding.ActivityRegisterBinding
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.tvSignIn.setOnClickListener {
            finish()
        }

        binding.btnRegister.setOnClickListener {
            val firstname = binding.etFirstname.text.toString().trim()
            val lastname = binding.etLastname.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val confirm = binding.etConfirmPassword.text.toString().trim()

            if (firstname.isEmpty() || lastname.isEmpty() || email.isEmpty() || password.isEmpty()) {
                showError("Please fill out all fields")
                return@setOnClickListener
            }

            if (password != confirm) {
                showError("Passwords do not match")
                return@setOnClickListener
            }

            binding.btnRegister.isEnabled = false
            binding.tvError.visibility = View.GONE

            lifecycleScope.launch {
                try {
                    val api = ApiClient.getClient(this@RegisterActivity)
                    val response = api.register(RegisterRequest(firstname, lastname, email, password))
                    
                    if (response.isSuccessful) {
                        val authResponse = response.body()
                        if (authResponse?.success == true) {
                            Toast.makeText(this@RegisterActivity, "Registration successful! Please sign in.", Toast.LENGTH_LONG).show()
                            finish()
                        } else {
                            showError(authResponse?.error?.message ?: "Registration failed")
                        }
                    } else {
                        showError("Registration failed: ${response.code()}")
                    }
                } catch (e: Exception) {
                    showError("Network error: ${e.message}")
                } finally {
                    binding.btnRegister.isEnabled = true
                }
            }
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }
}
