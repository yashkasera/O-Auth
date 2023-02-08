package com.yashkasera.oauth.repository.model

import com.google.gson.annotations.SerializedName

/**
 * @author yashkasera
 * Created 15/11/22 at 3:02 am
 */
data class Prompt(
    @SerializedName("_id")
    val id: String,

    @SerializedName("prompt")
    val prompt: String? = "",

    @SerializedName("client")
    val client_id: String?,

    @SerializedName("user")
    val user: String?,

    @SerializedName("status")
    val status: String?,

    @SerializedName("expiry")
    val expiry: Long? = null,

    @SerializedName("created_at")
    val createdAt: Long? = null
)