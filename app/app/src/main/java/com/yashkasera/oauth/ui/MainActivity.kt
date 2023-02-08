package com.yashkasera.oauth.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavController
import androidx.navigation.Navigation
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.NavigationUI
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.zxing.integration.android.IntentIntegrator
import com.yashkasera.oauth.AppObjectController
import com.yashkasera.oauth.R
import com.yashkasera.oauth.databinding.ActivityMainBinding
import com.yashkasera.oauth.ui.dialogs.ProgressDialog
import com.yashkasera.oauth.util.PrefManager
import com.yashkasera.oauth.util.Result
import kotlinx.coroutines.launch


class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val viewModel by lazy { ViewModelProvider(this)[MainViewModel::class.java] }
    private val progressDialog: ProgressDialog = ProgressDialog.newInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)
        addObservers()
        val appBarConfiguration: AppBarConfiguration = AppBarConfiguration.Builder(
            R.id.navigation_dashboard,
            R.id.navigation_websites,
            R.id.navigation_history,
        ).build()
        val navController: NavController = Navigation.findNavController(this, R.id.nav_host_fragment)
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.bottomNavigationView, navController);
    }

    private fun addObservers() {
        viewModel.taskResult.observe(this) {
            when(it){
                is Result.Error -> {
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Error-${it.exception.message}", Snackbar.LENGTH_SHORT)
                        .show()
                }

                is Result.Loading -> {
                    progressDialog.show(supportFragmentManager, "progress")
                }

                is Result.Success -> {
                    progressDialog.dismiss()
                    Snackbar
                        .make(binding.root, "Success", Snackbar.LENGTH_SHORT)
                        .show()
                }

                null -> {}
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> onBackPressed()
            R.id.action_scan -> {
                val intentIntegrator = IntentIntegrator(this)
                intentIntegrator.setPrompt("Scan a barcode or QR Code")
                intentIntegrator.setOrientationLocked(true)
                intentIntegrator.setBeepEnabled(true)
                intentIntegrator.initiateScan()
            }

            R.id.action_logout -> MaterialAlertDialogBuilder(this)
                .setTitle("Confirm Logout")
                .setMessage("Are you sure you want to logout?")
                .setPositiveButton("Yes") { dialog, _ ->
                    lifecycleScope.launch {
                        try {
                            val response = AppObjectController.commonNetworkService.logout()
                            if (response.isSuccessful) {
                                PrefManager.clear()
                                startActivity(Intent(this@MainActivity, AuthActivity::class.java).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK)
                                    finish()
                                })
                            }
                        } catch (e: Exception) {
                            Log.e("MainActivity.kt", "YASH => onOptionsItemSelected:59 ", e)
                            Snackbar.make(binding.root, "Error-${e.message}", Snackbar.LENGTH_SHORT).show()
                        }
                    }
                    dialog.dismiss()
                }
                .setNegativeButton("No") { dialog, _ ->
                    dialog.dismiss()
                }
                .show()
        }
        return super.onOptionsItemSelected(item)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val intentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (intentResult != null) {
            if (intentResult.contents == null) {
                Toast.makeText(baseContext, "Cancelled", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.approvePrompt(intentResult.contents)
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    companion object {
        @JvmStatic
        fun start(context: Context) {
            val starter = Intent(context, MainActivity::class.java)
            context.startActivity(starter)
        }
    }
}