package com.example.trackademia.main

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.trackademia.api.ApiClient
import com.example.trackademia.api.TaskRequest
import com.example.trackademia.databinding.FragmentTasksBinding
import kotlinx.coroutines.launch

class TasksFragment : Fragment() {

    private var _binding: FragmentTasksBinding? = null
    private val binding get() = _binding!!

    private lateinit var taskAdapter: TaskAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTasksBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        taskAdapter = TaskAdapter { task ->
            completeTask(task.id)
        }
        binding.rvTasks.adapter = taskAdapter

        binding.btnNewTask.setOnClickListener {
            showAddTaskDialog()
        }

        loadData()
    }

    private fun loadData() {
        lifecycleScope.launch {
            try {
                val api = ApiClient.getClient(requireContext())
                val response = api.getTasks()

                if (response.isSuccessful) {
                    val allTasks = response.body() ?: emptyList()
                    val pendingTasks = allTasks.filter { it.status != "completed" }
                    val completedCount = allTasks.size - pendingTasks.size
                    
                    taskAdapter.submitList(pendingTasks)
                    
                    val percent = if (allTasks.isNotEmpty()) (completedCount * 100) / allTasks.size else 0
                    binding.tvProgressPercent.text = "$percent%"
                    binding.progressBar.progress = percent
                    binding.tvProgressText.text = "$completedCount of ${allTasks.size} tasks completed"
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Failed to load tasks", Toast.LENGTH_SHORT).show()
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

    private fun showAddTaskDialog() {
        val context = requireContext()
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(50, 40, 50, 10)
        }

        val titleInput = EditText(context).apply { hint = "Title" }
        val descInput = EditText(context).apply { hint = "Description" }
        val dateInput = EditText(context).apply { hint = "Deadline (YYYY-MM-DD)" }
        val subjectInput = EditText(context).apply { hint = "Subject" }
        
        layout.addView(titleInput)
        layout.addView(descInput)
        layout.addView(dateInput)
        layout.addView(subjectInput)

        AlertDialog.Builder(context)
            .setTitle("New Task")
            .setView(layout)
            .setPositiveButton("Add") { _, _ ->
                val request = TaskRequest(
                    title = titleInput.text.toString(),
                    description = descInput.text.toString(),
                    deadline = dateInput.text.toString(),
                    subject = subjectInput.text.toString(),
                    priority = "medium"
                )
                addTask(request)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun addTask(request: TaskRequest) {
        lifecycleScope.launch {
            try {
                val api = ApiClient.getClient(requireContext())
                val response = api.createTask(request)
                if (response.isSuccessful) {
                    loadData()
                } else {
                    Toast.makeText(requireContext(), "Failed to add task", Toast.LENGTH_SHORT).show()
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
