package com.yashkasera.oauth

import com.google.gson.Gson
import com.localebro.okhttpprofiler.OkHttpProfilerInterceptor
import com.yashkasera.oauth.repository.CommonNetworkService
import com.yashkasera.oauth.util.interceptor.AuthorizationInterceptor
import com.yashkasera.oauth.util.interceptor.StatusCodeInterceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AppObjectController {
    companion object {

        @JvmStatic
        lateinit var gson: Gson

        @JvmStatic
        lateinit var oAuthApplication: OAuthApplication

        @JvmStatic
        lateinit var retrofit: Retrofit

        @JvmStatic
        lateinit var commonNetworkService: CommonNetworkService


        fun init(oAuthApplication: OAuthApplication) {
            this.oAuthApplication = oAuthApplication
            gson = Gson()
            val client = OkHttpClient.Builder()
                .addInterceptor(AuthorizationInterceptor())
                .addInterceptor(StatusCodeInterceptor())
            if (BuildConfig.DEBUG) {
                client.addInterceptor(HttpLoggingInterceptor().apply { setLevel(HttpLoggingInterceptor.Level.BODY) })
                client.addInterceptor(OkHttpProfilerInterceptor())
            }
            retrofit = Retrofit.Builder()
                .baseUrl(BuildConfig.BASE_URL)
                .client(client.build())
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()

            commonNetworkService = retrofit.create(CommonNetworkService::class.java)
        }
    }
}