package com.yashkasera.oauth.ui.auth

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.repository.model.LoginResponse
import com.yashkasera.oauth.repository.model.User
import com.yashkasera.oauth.util.PrefManager
import com.yashkasera.oauth.util.PrefManager.API_TOKEN
import com.yashkasera.oauth.util.Result
import com.yashkasera.oauth.util.getResult
import kotlinx.coroutines.launch

/**
 * @author yashkasera
 * Created 15/11/22 at 12:41 am
 */
class LoginViewModel : ViewModel() {
    val commonNetworkService by lazy {
        AppObjectController.commonNetworkService
    }

    val result = MutableLiveData<Result<LoginResponse>>()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            result.postValue(Result.Loading())
            val response = getResult { commonNetworkService.login(mapOf("email" to email, "password" to password)) }
            if (response is Result.Success) {
                PrefManager.put(API_TOKEN, response.data.token)
                User.update(response.data.user)
            }
            result.postValue(response)
        }
    }
}