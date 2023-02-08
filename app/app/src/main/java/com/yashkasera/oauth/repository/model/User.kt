package com.yashkasera.oauth.repository.model

import com.google.gson.annotations.SerializedName
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.util.PrefManager
import com.yashkasera.oauth.util.PrefManager.USER_INSTANCE

data class User(
    @SerializedName("_id")
    val id: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("email")
    val email: String,

    @SerializedName("phone")
    val phone: String,

    @SerializedName("fcm_token")
    val fcmToken: String? = ""
) {
    companion object {
        fun getInstance(): User? {
            PrefManager.getString(USER_INSTANCE, null)?.let {
                return AppObjectController.gson.fromJson(it, User::class.java)
            }
            return null
        }

        fun update(user: User) {
            PrefManager.put(USER_INSTANCE, AppObjectController.gson.toJson(user))
        }
    }
}

data class Token(
    @SerializedName("token")
    val token: String,

    @SerializedName("createdAt")
    val createdAt: String,

    @SerializedName("expiresAt")
    val expiresAt: String
)