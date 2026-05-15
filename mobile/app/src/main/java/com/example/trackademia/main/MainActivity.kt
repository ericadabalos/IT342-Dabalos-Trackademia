package com.example.trackademia.main

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.example.trackademia.R
import com.example.trackademia.auth.LoginActivity
import com.example.trackademia.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController
        binding.bottomNav.setupWithNavController(navController)
        
        binding.btnLogout.setOnClickListener {
            val sharedPrefs = getSharedPreferences("TrackademiaPrefs", Context.MODE_PRIVATE)
            sharedPrefs.edit().clear().apply()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}
