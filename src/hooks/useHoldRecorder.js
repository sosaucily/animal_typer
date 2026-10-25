import { useCallback, useEffect, useRef, useState } from 'react';

export function useHoldRecorder(onRecorded) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const heldRef = useRef(false);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const timerRef = useRef(null);

  const stop = useCallback(() => {
    heldRef.current = false;
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    heldRef.current = true;
    setError('');
    setSeconds(0);
    setStatus('preparing');
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        throw new Error('Recording needs a recent browser on HTTPS or localhost.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      streamRef.current = stream;
      if (!heldRef.current || !mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        busyRef.current = false;
        if (mountedRef.current) setStatus('idle');
        return;
      }
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      const chunks = [];
      const beganAt = Date.now();
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => {
        setError('The microphone stopped unexpectedly. Please try again.');
        stop();
      };
      recorder.onstop = async () => {
        clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (!mountedRef.current) return;
        setStatus('saving');
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          if (Date.now() - beganAt < 250 || !blob.size) throw new Error('That was a little short. Hold the button while you speak, then release.');
          await onRecorded(blob);
        } catch (issue) {
          if (mountedRef.current) setError(issue.message || 'Could not save this recording.');
        } finally {
          busyRef.current = false;
          recorderRef.current = null;
          if (mountedRef.current) setStatus('idle');
        }
      };
      recorder.start();
      setStatus('recording');
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - beganAt) / 1000);
        setSeconds(elapsed);
        if (elapsed >= 15) stop();
      }, 100);
    } catch (issue) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      busyRef.current = false;
      if (mountedRef.current) {
        setStatus('idle');
        setError(issue.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in your browser’s site settings, then try again.'
          : issue.name === 'NotFoundError' ? 'No microphone found. Connect one and try again.' : issue.message);
      }
    }
  }, [onRecorded, stop]);

  useEffect(() => {
    mountedRef.current = true;
    const hide = () => { if (document.hidden) stop(); };
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', hide);
    return () => {
      mountedRef.current = false;
      heldRef.current = false;
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', hide);
      clearInterval(timerRef.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [stop]);

  return { start, stop, status, seconds, error, busy: status !== 'idle' };
}
