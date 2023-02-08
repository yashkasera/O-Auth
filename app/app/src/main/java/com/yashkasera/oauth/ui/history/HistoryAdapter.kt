package com.yashkasera.oauth.ui.history

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.yashkasera.oauth.databinding.ItemHistoryBinding
import com.yashkasera.oauth.repository.model.History

class HistoryAdapter : ListAdapter<History, HistoryAdapter.HistoryViewHolder>(DiffCallback) {

    object DiffCallback : DiffUtil.ItemCallback<History>() {
        override fun areItemsTheSame(oldItem: History, newItem: History): Boolean =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: History, newItem: History): Boolean =
            oldItem == newItem
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHolder =
        HistoryViewHolder(
            ItemHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )

    override fun onBindViewHolder(holder: HistoryViewHolder, position: Int) =
        holder.bind(getItem(position))


    inner class HistoryViewHolder(private val binding: ItemHistoryBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(history: History) {
            binding.history = history
        }
    }
}