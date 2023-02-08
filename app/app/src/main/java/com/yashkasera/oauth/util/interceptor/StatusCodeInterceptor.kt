package com.yashkasera.oauth.util.interceptor

import android.content.Intent
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.ui.AuthActivity
import com.yashkasera.oauth.util.PrefManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.Interceptor
import okhttp3.Response

class StatusCodeInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val response = chain.proceed(chain.request())
        if (response.code in 401..403) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    PrefManager.clear()
//                    AppObjectController.commonNetworkService.logout()
                    AppObjectController.oAuthApplication.startActivity(
                        Intent(
                            AppObjectController.oAuthApplication,
                            AuthActivity::class.java
                        ).apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                        }
                    )
                } catch (e: Exception) {
//                    showToast(e.message)
                    e.printStackTrace()
                }
            }
        }
        return response
    }
}