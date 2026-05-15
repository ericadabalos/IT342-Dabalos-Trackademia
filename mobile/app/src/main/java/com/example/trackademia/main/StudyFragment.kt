package com.example.trackademia.main

import android.media.MediaPlayer
import android.os.Bundle
import android.os.CountDownTimer
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.trackademia.databinding.FragmentStudyBinding

class StudyFragment : Fragment() {

    private var _binding: FragmentStudyBinding? = null
    private val binding get() = _binding!!

    private var countDownTimer: CountDownTimer? = null
    private var timeLeftInMillis: Long = 0
    private var isRunning = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentStudyBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnSet.setOnClickListener {
            val h = binding.etHours.text.toString().toLongOrNull() ?: 0
            val m = binding.etMinutes.text.toString().toLongOrNull() ?: 0
            val s = binding.etSeconds.text.toString().toLongOrNull() ?: 0

            timeLeftInMillis = (h * 3600 + m * 60 + s) * 1000
            
            if (timeLeftInMillis > 0) {
                binding.tvStatus.text = "Timer Set"
                updateCountDownText()
            }
        }

        binding.btnToggle.setOnClickListener {
            if (isRunning) {
                pauseTimer()
            } else {
                startTimer()
            }
        }

        binding.btnReset.setOnClickListener {
            resetTimer()
        }
    }

    private fun startTimer() {
        if (timeLeftInMillis <= 0) return

        countDownTimer = object : CountDownTimer(timeLeftInMillis, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                timeLeftInMillis = millisUntilFinished
                updateCountDownText()
            }

            override fun onFinish() {
                isRunning = false
                binding.btnToggle.text = "Play"
                binding.tvStatus.text = "Time's up!"
                playAlarm()
            }
        }.start()

        isRunning = true
        binding.btnToggle.text = "Pause"
        binding.tvStatus.text = "Timer Started"
    }

    private fun pauseTimer() {
        countDownTimer?.cancel()
        isRunning = false
        binding.btnToggle.text = "Play"
        binding.tvStatus.text = "Paused"
    }

    private fun resetTimer() {
        countDownTimer?.cancel()
        isRunning = false
        timeLeftInMillis = 0
        updateCountDownText()
        binding.btnToggle.text = "Play"
        binding.tvStatus.text = "Ready"
    }

    private fun updateCountDownText() {
        val hours = (timeLeftInMillis / 1000) / 3600
        val minutes = ((timeLeftInMillis / 1000) % 3600) / 60
        val seconds = (timeLeftInMillis / 1000) % 60

        val timeFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds)
        binding.tvTimer.text = timeFormatted
    }

    private fun playAlarm() {
        // Native beep as fallback
        try {
            val toneG = android.media.ToneGenerator(android.media.AudioManager.STREAM_ALARM, 100)
            toneG.startTone(android.media.ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 1500)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        countDownTimer?.cancel()
        _binding = null
    }
}
