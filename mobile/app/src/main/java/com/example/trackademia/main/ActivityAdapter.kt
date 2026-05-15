package com.example.trackademia.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.trackademia.api.ActivityLog
import com.example.trackademia.databinding.ItemActivityBinding

class ActivityAdapter : RecyclerView.Adapter<ActivityAdapter.ActivityViewHolder>() {

    private var activities = listOf<ActivityLog>()

    fun submitList(newList: List<ActivityLog>) {
        activities = newList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ActivityViewHolder {
        val binding = ItemActivityBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ActivityViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ActivityViewHolder, position: Int) {
        val activity = activities[position]
        holder.bind(activity)
    }

    override fun getItemCount(): Int = activities.size

    inner class ActivityViewHolder(private val binding: ItemActivityBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(activity: ActivityLog) {
            binding.tvAction.text = activity.actionType
            binding.tvDescription.text = activity.description
        }
    }
}
