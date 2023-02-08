package com.yashkasera.oauth.util.interceptor

import com.yashkasera.oauth.BuildConfig
import com.yashkasera.oauth.util.*
import com.yashkasera.oauth.util.PrefManager.API_TOKEN
import okhttp3.Interceptor
import okhttp3.Response

class AuthorizationInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
        if (PrefManager.getString(API_TOKEN).isNotEmpty())
            request.addHeader(KEY_AUTHORIZATION, PrefManager.getString(API_TOKEN))
        request.addHeader(KEY_APP_VERSION_NAME, BuildConfig.VERSION_NAME)
        request.addHeader(KEY_APP_VERSION_CODE, BuildConfig.VERSION_CODE.toString())
        request.addHeader(
            KEY_APP_USER_AGENT, "APP_" + BuildConfig.VERSION_NAME + "_" + BuildConfig.VERSION_CODE.toString()
        )
        return chain.proceed(request.build())
    }
}