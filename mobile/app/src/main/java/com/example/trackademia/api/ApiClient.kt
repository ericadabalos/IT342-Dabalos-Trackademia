package com.example.trackademia.api

import android.content.Context
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    // 10.0.2.2 is the special alias to your host loopback interface in Android Emulator
    private const val BASE_URL = "http://10.0.2.2:8086/api/"

    private var retrofit: Retrofit? = null

    fun getClient(context: Context): ApiService {
        if (retrofit == null) {
            val client = OkHttpClient.Builder().addInterceptor { chain ->
                val requestBuilder = chain.request().newBuilder()
                
                // Get token from SharedPreferences
                val sharedPrefs = context.getSharedPreferences("TrackademiaPrefs", Context.MODE_PRIVATE)
                val token = sharedPrefs.getString("token", null)
                
                if (token != null) {
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }
                requestBuilder.addHeader("Content-Type", "application/json")
                
                chain.proceed(requestBuilder.build())
            }.build()

            retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofit!!.create(ApiService::class.java)
    }
}
