package com.yashkasera.oauth.util

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.repository.model.User
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * @author yashkasera
 * Created 15/11/22 at 12:46 am
 */
class FCMService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCMService.kt", "YASH => onNewToken:14 $token")
        if (User.getInstance() != null) {
            CoroutineScope(Dispatchers.Main).launch {
                try {
                    AppObjectController.commonNetworkService.updateFCM(mapOf("fcm_token" to token))
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        Log.d("FCMService.kt", "YASH => onMessageReceived:17 '${message.notification}${message.data}")
    }
}