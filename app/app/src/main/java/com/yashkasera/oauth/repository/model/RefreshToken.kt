package com.yashkasera.oauth.repository.model

import com.google.gson.annotations.SerializedName

/**
 * @author yashkasera
 * Created 15/11/22 at 4:13 am
 */
data class RefreshToken(
    @SerializedName("id")
    val id: String = "",

    @SerializedName("client")
    val client: String = "",

    @SerializedName("status")
    val status: String = "",

    @SerializedName("updated_at")
    val updatedAt: Long,
)
