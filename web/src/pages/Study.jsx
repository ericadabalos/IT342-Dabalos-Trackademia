import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import LoadingScreen from "./LoadingScreen";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0e1a;
  color: #e2eaf8;
`;

const MainContent = styled.main`
  margin-left: 220px;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PageTitle = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 34px;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #8da4c8;
  font-size: 14px;
  margin: 0;
`;

const TimerCard = styled.div`
  background: #0f1626;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.18);
`;

const TimeDisplay = styled.div`
  font-size: clamp(58px, 7vw, 88px);
  line-height: 1.05;
  font-weight: 800;
  font-family: 'Inter', 'Syne', sans-serif;
  letter-spacing: 0.08em;
  text-align: center;
  color: #edf2fb;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
`;

const TimerLabel = styled.div`
  text-align: center;
  font-size: 20px;
  color: #8da4c8;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
`;

const ControlButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  min-width: 44px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;

  ${({ variant }) => variant === "primary" && `
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: #fff;
  `}

  ${({ variant }) => variant === "secondary" && `
    background: transparent;
    border: 1px solid #1e2a45;
    color: #60a5fa;
  `}

  &:hover {
    transform: translateY(-1px);
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #8da4c8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  background: #0f1629;
  border: 1px solid #1e2a45;
  border-radius: 12px;
  color: #e2eaf8;
  padding: 12px 14px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #60a5fa;
  }
`;

const StatusText = styled.div`
  text-align: center;
  color: #60a5fa;
  font-size: 14px;
  font-weight: 600;
`;

export default function Study() {
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [status, setStatus] = useState("Ready");
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      setStatus("Time's up!");
      playAlarm();
    }
  }, [remainingSeconds, isRunning]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timeout);
  }, []);

  const formatDisplay = (secondsValue) => {
    const hrs = Math.floor(secondsValue / 3600);
    const mins = Math.floor((secondsValue % 3600) / 60);
    const secs = secondsValue % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSetTimer = () => {
    const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (total <= 0) {
      setStatus("Enter a time greater than 0.");
      return;
    }

    setRemainingSeconds(total);
    setIsRunning(true);
    setIsEditing(false);
    setStatus("Timer started");
  };

  const handlePause = () => {
    setIsRunning(prev => !prev);
    setStatus(prev => (prev === "Paused" ? "Resumed" : "Paused"));
  };

  const handleEdit = () => {
    if (isRunning) setIsRunning(false);
    setIsEditing(true);
    setStatus("Editing timer");
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsEditing(true);
    setRemainingSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setLabel("");
    setStatus("Ready");
  };

  const playAlarm = () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);

    oscillator.onended = () => {
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      audioCtx.close();
    };
  };

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <LoadingScreen />
      </>
    );
  }

  return (
    <PageContainer>
      <GlobalStyles />
      <Sidebar activePage="study" handleLogout={() => navigate("/")} />
      <MainContent>
        <Header>
          <TitleArea>
            <PageTitle>Study Timer</PageTitle>
            <Subtitle>Set a focus timer, add a label, and stay on schedule.</Subtitle>
          </TitleArea>
        </Header>

        <TimerCard>
          <TimerLabel>{label || "No label set"}</TimerLabel>
          <TimeDisplay>{formatDisplay(remainingSeconds)}</TimeDisplay>
          <StatusText>{status}</StatusText>

          <InputGrid>
            <InputGroup>
              <Label>Timer label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Study Math" />
            </InputGroup>
            <InputGroup>
              <Label>Hours</Label>
              <Input type="number" min="0" value={hours} onChange={(e) => setHours(Math.max(0, Number(e.target.value)))} />
            </InputGroup>
            <InputGroup>
              <Label>Minutes</Label>
              <Input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))} />
            </InputGroup>
            <InputGroup>
              <Label>Seconds</Label>
              <Input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} />
            </InputGroup>
          </InputGrid>

          <ControlsRow>
            <ControlButton variant="primary" onClick={handleSetTimer}>Set</ControlButton>
            <ControlButton variant="secondary" onClick={handlePause} disabled={remainingSeconds <= 0} title={isRunning ? "Pause" : "Resume"}>
              {isRunning ? "⏸" : "▶"}
            </ControlButton>
            <ControlButton variant="secondary" onClick={handleEdit} title="Edit">
              ✏️
            </ControlButton>
            <ControlButton variant="secondary" onClick={handleReset} title="Reset">
              ⟲
            </ControlButton>
          </ControlsRow>
        </TimerCard>
      </MainContent>
    </PageContainer>
  );
}
