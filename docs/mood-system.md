# Moodify Mood Detection & Relief Zone Specification

## 1. Browser AI Emotion Scanner
- **Methodology**: Local canvas face detection using `face-api.js` (TinyFaceDetector + FaceExpressionNet).
- **Emotions Mapped**: Happy, Sad, Angry, Calm, Neutral, Excited, Stressed.
- **Opt-In Controls**: Users must click "Start Camera Scan" explicitly. A red "Stop Camera" button disables the camera stream instantly.
- **Privacy Assurance**: No frames leave the client browser.

## 2. Relief Zone Transition Engine
- **Purpose**: Helps users move from negative or tense emotional states toward positive or relaxing states.
- **Transition Mapping**:
  - `Sad` → `Calm / Hopeful / Comfort`
  - `Angry` → `Calm / Relaxing / Nature Sounds`
  - `Stressed` → `Focus / Ambient / Relaxation`
  - `Low Energy` → `Motivation / Energetic`
  - `Overwhelmed` → `Mind Refresh / Focus`

## 3. Non-Medical Disclaimer
Emotion detection and Relief Zone audio recommendations are personalized entertainment features only. They are not medical tools.
