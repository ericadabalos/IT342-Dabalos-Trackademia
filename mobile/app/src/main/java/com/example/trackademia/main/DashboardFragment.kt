package com.example.trackademia.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.trackademia.api.ApiClient
import com.example.trackademia.databinding.FragmentDashboardBinding
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    private lateinit var taskAdapter: TaskAdapter
    private lateinit var activityAdapter: ActivityAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val dateFormat = SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.US)
        binding.tvDate.text = dateFormat.format(Date())

        taskAdapter = TaskAdapter { task ->
            completeTask(task.id)
        }
        activityAdapter = ActivityAdapter()

        binding.rvTasks.adapter = taskAdapter
        binding.rvActivities.adapter = activityAdapter

        loadData()
    }

    private fun loadData() {
        lifecycleScope.launch {
            try {
                val api = ApiClient.getClient(requireContext())
                val tasksResponse = api.getTasks()
                val activitiesResponse = api.getActivities()

                if (tasksResponse.isSuccessful) {
                    val pendingTasks = tasksResponse.body()?.filter { it.status != "completed" } ?: emptyList()
                    taskAdapter.submitList(pendingTasks)
                }

                if (activitiesResponse.isSuccessful) {
                    activityAdapter.submitList(activitiesResponse.body() ?: emptyList())
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Failed to load data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun completeTask(taskId: Int) {
        lifecycleScope.launch {
            try {
                val api = ApiClient.getClient(requireContext())
                val response = api.completeTask(taskId)
                if (response.isSuccessful) {
                    loadData()
                } else {
                    Toast.makeText(requireContext(), "Failed to complete task", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
