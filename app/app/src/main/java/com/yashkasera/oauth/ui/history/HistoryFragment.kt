package com.yashkasera.oauth.ui.history

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
import com.yashkasera.oauth.util.Result


class HistoryFragment : Fragment() {
    private lateinit var binding: FragmentListBinding
    private val viewModel by lazy {
        ViewModelProvider(this)[MainViewModel::class.java]
    }
    private val progressDialog: ProgressDialog = ProgressDialog.newInstance()
    private val historyAdapter = HistoryAdapter()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        binding = FragmentListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel.getHistory()
        addObservers()
        binding.recyclerView.adapter = historyAdapter
        binding.swipeRefreshLayout.setOnRefreshListener { viewModel.getHistory() }
        binding.btnRefresh.setOnClickListener { viewModel.getHistory() }
    }

    private fun addObservers() {
        viewModel.historyResult.observe(viewLifecycleOwner) {
            when (it) {
                is Result.Error -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Error-${it.exception.message}", Snackbar.LENGTH_SHORT)
                        .setAction("Retry") { viewModel.getHistory() }
                        .show()
                }
                is Result.Loading -> {
                    binding.swipeRefreshLayout.isRefreshing = true
                    progressDialog.show(childFragmentManager, "progress")
                }
                is Result.Success -> {
                    binding.swipeRefreshLayout.isRefreshing = false
                    progressDialog.dismiss()
                    historyAdapter.submitList(it.data)
                    binding.cardNoResults.isVisible = it.data.isEmpty()
                }
                null -> {}
            }
        }
    }
}