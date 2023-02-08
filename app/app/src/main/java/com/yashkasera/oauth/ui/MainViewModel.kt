package com.yashkasera.oauth.ui

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.repository.model.ApiResponse
import com.yashkasera.oauth.repository.model.History
import com.yashkasera.oauth.repository.model.Prompt
import com.yashkasera.oauth.repository.model.RefreshToken
import com.yashkasera.oauth.util.Result
import com.yashkasera.oauth.util.getResult
import kotlinx.coroutines.launch
import java.sql.Ref

/**
 * @author yashkasera
 * Created 15/11/22 at 3:01 am
 */
class MainViewModel : ViewModel() {
    val homeResult = MutableLiveData<Result<List<Prompt>>>()
    val taskResult = MutableLiveData<Result<ApiResponse>?>()
    val historyResult :MutableLiveData<Result<List<History>>?> = MutableLiveData()
    val refreshTokenResult :MutableLiveData<Result<List<RefreshToken>>?> = MutableLiveData()
    private val service = AppObjectController.commonNetworkService

    fun getPrompts() {
        viewModelScope.launch {
            homeResult.postValue(Result.Loading())
            val result = getResult { service.getPrompts() }
            homeResult.postValue(result)
        }
    }

    fun approvePrompt(id: String) {
        viewModelScope.launch {
            taskResult.postValue(Result.Loading())
            taskResult.postValue(getResult { service.approvePrompt(id) })
        }
    }

    fun getHistory() {
        viewModelScope.launch {
            historyResult.postValue(Result.Loading())
            historyResult.postValue(getResult { service.getHistory() })
        }
    }

    fun getWebsites() {
        viewModelScope.launch {
            refreshTokenResult.postValue(Result.Loading())
            refreshTokenResult.postValue(getResult { service.getWebsites() })
        }
    }

    fun revokeToken(it: String) {
        viewModelScope.launch {
            taskResult.postValue(Result.Loading())
            taskResult.postValue(getResult { service.revokeToken(it) })
        }
    }
}