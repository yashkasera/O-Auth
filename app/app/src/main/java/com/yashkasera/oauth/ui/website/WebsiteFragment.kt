package com.yashkasera.oauth.ui.website

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.snackbar.Snackbar
import com.yashkasera.oauth.databinding.FragmentListBinding
import com.yashkasera.oauth.ui.MainViewModel
import com.yashkasera.oauth.ui.dialogs.ProgressDialog
import com.yashkasera.oauth.ui.history.HistoryAdapter
import com.yashkasera.oauth.util.Result

class WebsiteFragment : Fragment() {

    private lateinit var binding: FragmentListBinding
    private val viewModel by lazy {
        ViewModelProvider(this)[MainViewModel::class.java]
    }
    private val progressDialog: ProgressDialog = ProgressDialog.newInstance()
    private val websiteAdapter = WebsiteAdapter()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        binding = FragmentListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel.getWebsites()
        addObservers()
        binding.recyclerView.adapter = websiteAdapter
        websiteAdapter.setOnItemClickListener {
            viewModel.revokeToken(it.id)
        }
        binding.swipeRefreshLayout.setOnRefreshListener { viewModel.getWebsites() }
        binding.btnRefresh.setOnClickListener { viewModel.getWebsites() }
    }

    private fun addObservers() {
        viewModel.refreshTokenResult.observe(viewLifecycleOwner) {
            when (it) {
                is Result.Error -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Error-${it.exception.message}", Snackbar.LENGTH_SHORT)
                        .setAction("Retry") { viewModel.getWebsites() }
                        .show()
                }

                is Result.Loading -> {
                    progressDialog.show(childFragmentManager, "progress")
                    binding.swipeRefreshLayout.isRefreshing = true
                }

                is Result.Success -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    binding.cardNoResults.isVisible = it.data.isEmpty()
                    websiteAdapter.submitList(it.data)
                }
                null -> {}
            }
        }
        viewModel.taskResult.observe(viewLifecycleOwner) {
            when (it) {
                is Result.Error -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Error-${it.exception.message}", Snackbar.LENGTH_SHORT)
                        .show()
                }

                is Result.Loading -> {
                    binding.swipeRefreshLayout.isRefreshing = true
                    progressDialog.show(childFragmentManager, "progress")
                }

                is Result.Success -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    viewModel.getWebsites()
                }

                null -> {}
            }
        }
    }
}