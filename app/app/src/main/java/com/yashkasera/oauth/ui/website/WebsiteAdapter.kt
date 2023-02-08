package com.yashkasera.oauth.ui.website

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.yashkasera.oauth.R
import com.yashkasera.oauth.databinding.ItemWebsiteBinding
import com.yashkasera.oauth.repository.model.RefreshToken

class WebsiteAdapter : ListAdapter<RefreshToken, WebsiteAdapter.WebsiteViewHolder>(DiffCallback) {

    private var onItemClickListener: ((RefreshToken) -> Unit)? = null

    object DiffCallback : DiffUtil.ItemCallback<RefreshToken>() {
        override fun areItemsTheSame(oldItem: RefreshToken, newItem: RefreshToken): Boolean =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: RefreshToken, newItem: RefreshToken): Boolean =
            oldItem == newItem
    }

    fun setOnItemClickListener(onItemClickListener: (RefreshToken) -> Unit) {
        this.onItemClickListener = onItemClickListener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WebsiteViewHolder =
        WebsiteViewHolder(
            ItemWebsiteBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )

    override fun onBindViewHolder(holder: WebsiteViewHolder, position: Int) =
        holder.bind(getItem(position))


    inner class WebsiteViewHolder(private val binding: ItemWebsiteBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(refreshToken: RefreshToken) {
            binding.website = refreshToken
            binding.btnRevoke.setOnClickListener { onItemClickListener?.invoke(refreshToken) }
            if (refreshToken.status == "revoked") {
                binding.btnRevoke.isEnabled = false
                binding.btnRevoke.backgroundTintList = binding.root.context.getColorStateList(android.R.color.darker_gray)
            } else{
                binding.btnRevoke.isEnabled = true
                binding.btnRevoke.backgroundTintList = binding.root.context.getColorStateList(R.color.red)
            }
        }
    }
}