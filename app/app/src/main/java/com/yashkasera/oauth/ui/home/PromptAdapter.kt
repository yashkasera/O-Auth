package com.yashkasera.oauth.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.yashkasera.oauth.databinding.ItemPromptBinding
import com.yashkasera.oauth.repository.model.Prompt

/**
 * @author yashkasera
 * Created 15/11/22 at 3:28 am
 */
class PromptAdapter : ListAdapter<Prompt, PromptAdapter.PromptViewHolder>(DiffCallback) {

    private var onItemClickListener: ((Prompt) -> Unit)? = null

    object DiffCallback : DiffUtil.ItemCallback<Prompt>() {
        override fun areItemsTheSame(oldItem: Prompt, newItem: Prompt): Boolean =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: Prompt, newItem: Prompt): Boolean =
            oldItem == newItem
    }

    fun setOnItemClickListener(onItemClickListener: (Prompt) -> Unit) {
        this.onItemClickListener = onItemClickListener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PromptViewHolder =
        PromptViewHolder(
            ItemPromptBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )

    override fun onBindViewHolder(holder: PromptViewHolder, position: Int) =
        holder.bind(getItem(position))


    inner class PromptViewHolder(private val binding: ItemPromptBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(prompt: Prompt) {
            binding.prompt = prompt
            binding.btnApprove.setOnClickListener { onItemClickListener?.invoke(prompt) }
        }
    }
}