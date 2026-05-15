package com.example.trackademia.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.trackademia.api.Task
import com.example.trackademia.databinding.ItemTaskBinding

class TaskAdapter(private val onCompleteClick: (Task) -> Unit) : RecyclerView.Adapter<TaskAdapter.TaskViewHolder>() {

    private var tasks = listOf<Task>()

    fun submitList(newList: List<Task>) {
        tasks = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val binding = ItemTaskBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TaskViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task = tasks[position]
        holder.bind(task)
    }

    override fun getItemCount(): Int = tasks.size

    inner class TaskViewHolder(private val binding: ItemTaskBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(task: Task) {
            binding.tvTitle.text = task.title
            binding.tvPriority.text = task.priority
            binding.tvSubject.text = task.subject
            binding.tvDeadline.text = "Due: ${task.deadline}"
            
            binding.btnComplete.setOnClickListener {
                onCompleteClick(task)
            }
        }
    }
}
