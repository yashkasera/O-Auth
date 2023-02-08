package com.yashkasera.oauth.ui

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.yashkasera.oauth.databinding.ActivitySplashBinding
import com.yashkasera.oauth.util.PrefManager
import com.yashkasera.oauth.util.PrefManager.API_TOKEN

@SuppressLint("CustomSplashScreen")
class SplashActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)
        if (PrefManager.hasKey(API_TOKEN)) {
            MainActivity.start(this)
        } else {
            AuthActivity.start(this)
        }
        finish()
    }
}