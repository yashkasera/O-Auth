package com.yashkasera.oauth.repository.model

import com.google.gson.annotations.SerializedName

/**
 * @author yashkasera
 * Created 15/11/22 at 4:13 am
 */
data class History(
    @SerializedName("id")
    val id: String = "",

    @SerializedName("client")
    val client: String = "",

    @SerializedName("last_used")
    val lastUsed: Long,
)
