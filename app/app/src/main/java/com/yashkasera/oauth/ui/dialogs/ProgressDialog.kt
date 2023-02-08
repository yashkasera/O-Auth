package com.yashkasera.oauth.ui.dialogs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.yashkasera.oauth.databinding.DialogProgressBinding

class ProgressDialog : BottomSheetDialogFragment() {
    private lateinit var binding: DialogProgressBinding
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = DialogProgressBinding.inflate(inflater, container, false)
        dialog?.setCancelable(false)
        return binding.root
    }

    companion object {
        fun newInstance(): ProgressDialog {
            return ProgressDialog()
        }
    }
}