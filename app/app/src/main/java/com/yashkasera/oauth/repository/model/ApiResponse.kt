package com.yashkasera.oauth.repository.model

import com.google.gson.annotations.SerializedName

/**
 * @author yashkasera
 * Created 15/11/22 at 3:48 am
 */
data class ApiResponse(
    @SerializedName("message")
    val message: String? = ""
)
