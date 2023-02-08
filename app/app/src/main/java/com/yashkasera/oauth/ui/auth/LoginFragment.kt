package com.yashkasera.oauth.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.snackbar.Snackbar
import com.yashkasera.oauth.ui.MainActivity
import com.yashkasera.oauth.databinding.FragmentLoginBinding
import com.yashkasera.oauth.ui.dialogs.ProgressDialog
import com.yashkasera.oauth.util.Result

class LoginFragment : Fragment() {
    private lateinit var binding: FragmentLoginBinding
    private val progressDialog: ProgressDialog = ProgressDialog.newInstance()
    private val viewModel by lazy {
        ViewModelProvider(this)[LoginViewModel::class.java]
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnLogin.setOnClickListener { login() }

        viewModel.result.observe(viewLifecycleOwner) {
            when (it) {
                is Result.Loading -> progressDialog.show(childFragmentManager, "progress")
                is Result.Error -> {
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Error-${it.exception.message}", Snackbar.LENGTH_SHORT)
                        .setAction("Retry") { login() }
                        .show()
                }
                is Result.Success -> {
                    progressDialog.dismiss()
                    startActivity(Intent(requireActivity(), MainActivity::class.java)).also {
                        requireActivity().finish()
                    }
                }
            }
        }
    }

    private fun login() {
        val email = binding.etEmail.text.toString()
        val password = binding.etPassword.text.toString()
        if (email.isEmpty() || password.isEmpty()) {
            Snackbar.make(binding.root, "Invalid email/password!", Snackbar.LENGTH_SHORT).show()
            return
        }
        viewModel.login(email, password)
    }
}