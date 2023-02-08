package com.yashkasera.oauth.util

import androidx.databinding.BindingAdapter
import com.google.android.material.chip.Chip
import com.google.android.material.textview.MaterialTextView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale


@BindingAdapter("setTime")
fun setTime(view: MaterialTextView, time: Long) {
    val sdf = SimpleDateFormat("dd/MM/yyyy HH:mm a", Locale.getDefault())
    view.text = sdf.format(Date(time))
}

@BindingAdapter("setTime")
fun setTime(view: Chip, time: Long) {
    val sdf = SimpleDateFormat("dd/MM/yyyy HH:mm a", Locale.getDefault())
    view.text = sdf.format(Date(time))
}