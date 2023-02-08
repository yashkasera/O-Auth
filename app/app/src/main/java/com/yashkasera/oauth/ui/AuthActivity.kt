package com.yashkasera.oauth.ui

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.yashkasera.oauth.databinding.ActivityAuthBinding

class AuthActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAuthBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    companion object {
        @JvmStatic
        fun start(context: Context) {
            val starter = Intent(context, AuthActivity::class.java)
            context.startActivity(starter)
        }
    }
}