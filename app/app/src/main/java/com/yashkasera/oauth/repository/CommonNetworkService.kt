package com.yashkasera.oauth.repository

import com.yashkasera.oauth.repository.model.ApiResponse
import com.yashkasera.oauth.repository.model.History
import com.yashkasera.oauth.repository.model.LoginResponse
import com.yashkasera.oauth.repository.model.Prompt
import com.yashkasera.oauth.repository.model.RefreshToken
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Query

private const val DIR = "api/v1"

interface CommonNetworkService {
    @POST("$DIR/user/login/")
    suspend fun login(
        @Body loginRequest: Map<String, String>
    ): Response<LoginResponse>

    @PATCH("$DIR/user/")
    suspend fun updateFCM(
        @Body fcmRequest: Map<String, String>
    ): Response<Any>

    @POST("$DIR/user/logout/")
    suspend fun logout(): Response<Any>

    @GET("$DIR/user/history/")
    suspend fun getHistory(): Response<List<History>>

    @POST("$DIR/verify/")
    suspend fun verify(): Response<Any>

    @GET("$DIR/prompt/")
    suspend fun getPrompts(): Response<List<Prompt>>

    @GET("$DIR/prompt/approve")
    suspend fun approvePrompt(@Query("id") id: String): Response<ApiResponse>

    @GET("$DIR/user/website/")
    suspend fun getWebsites(): Response<List<RefreshToken>>

    @GET("$DIR/user/token/revoke")
    suspend fun revokeToken(@Query("_id") id: String) : Response<ApiResponse>

}