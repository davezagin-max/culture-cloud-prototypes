import { useState } from 'react';
import { flows } from './data/mockData.js';
import QrFlow from './flows/QrFlow.jsx';
import ReminderFlow from './flows/ReminderFlow.jsx';
import VideoFlow from './flows/VideoFlow.jsx';
import { navigate, useHashRoute } from './lib/useHashRoute.js';
import Home from './pages/Home.jsx';

// Routes (hash-based):  #/  ·  #/video  ·  #/qr  ·  #/reminders
// "#/qr/form" is where the QR code on the printed card points.
const routes = { video: VideoFlow, qr: QrFlow, reminders: ReminderFlow };

// Restarting a flow remounts it, which resets every bit of its state.
function FlowRoute({ Flow, flow, initialStep }) {
  const [run, setRun] = useState(0);
  const restart = () => {
    navigate(flow.path);
    setRun((n) => n + 1);
  };
  return <Flow key={run} initialStep={run === 0 ? initialStep : undefined} onRestart={restart} />;
}

export default function App() {
  const [name, stepParam] = useHashRoute();
  const Flow = routes[name];
  if (!Flow) return <Home />;
  return <FlowRoute key={name} Flow={Flow} flow={flows[name]} initialStep={stepParam} />;
}
