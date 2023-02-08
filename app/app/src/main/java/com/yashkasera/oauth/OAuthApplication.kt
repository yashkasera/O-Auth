package com.yashkasera.oauth

import android.app.Application

class OAuthApplication: Application() {
    override fun onCreate() {
        super.onCreate()
        AppObjectController.init(this)
    }
}