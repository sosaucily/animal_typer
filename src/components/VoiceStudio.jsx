import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Mic, Play, Trash2, Upload, X } from 'lucide-react';
import { ALPHABET_DATA } from '../data/animals';
import { useHoldRecorder } from '../hooks/useHoldRecorder';
import { copyLegacyRecordings, deleteRecording, exportLegacyVoicePack, exportVoicePack, getLegacyRecordings, getVoiceLibrary, importVoicePack, normalizeLegacyRecordings, saveRecording, setUsesPersonalVoice, usesPersonalVoice } from '../utils/voiceStore';
import AnimalPicture from './AnimalPicture';

const PROMPTS = ALPHABET_DATA.map(({ letter, animal }) => ({
  id: `phrase-${letter}`, letter, animal, type: 'Full sentence', text: `${letter} is for ${animal}!`,
}));

export default function VoiceStudio({ onClose }) {
  const [index, setIndex] = useState(0);
  const [recordings, setRecordings] = useState({});
  const [enabled, setEnabled] = useState(usesPersonalVoice);
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [legacyCount, setLegacyCount] = useState(0);
  const audioRef = useRef(null);
  const fileRef = useRef(null);
  const closeRef = useRef(null);
  const keyboardHeldRef = useRef(false);
  const prompt = PROMPTS[index];

  const refresh = useCallback(async () => {
    const library = await getVoiceLibrary();
    setCanEdit(library.canEdit);
    setRecordings(Object.fromEntries(library.recordings.map((clip) => [clip.id, clip])));
    const legacy = normalizeLegacyRecordings(await getLegacyRecordings().catch(() => []));
    const stored = new Set(library.recordings.map(({ id }) => id));
    setLegacyCount(legacy.filter(({ id }) => !stored.has(id)).length);
  }, []);

  useEffect(() => {
    refresh().catch((issue) => setStorageError(issue.message || 'Project voice files could not be loaded.')).finally(() => setLoading(false));
  }, [refresh]);

  const stopPreview = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
  }, []);

  const recorded = useCallback(async (blob) => {
    await saveRecording(prompt.id, blob);
    await refresh();
    setMessage('Saved to the project! Listen back, record another take, or continue.');
  }, [prompt.id, refresh]);
  const { start, stop, status, seconds, error, busy } = useHoldRecorder(recorded);
  const locked = busy || loading || transferring || Boolean(storageError);

  const begin = useCallback(() => {
    if (loading || transferring || storageError || !canEdit) return;
    stopPreview();
    setMessage('');
    start();
  }, [loading, transferring, storageError, canEdit, start, stopPreview]);

  const navigate = useCallback((next) => {
    if (locked) return;
    stopPreview();
    setMessage('');
    setIndex(Math.max(0, Math.min(PROMPTS.length - 1, next)));
  }, [locked, stopPreview]);

  useEffect(() => {
    const keydown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'SELECT', 'TEXTAREA', 'AUDIO'].includes(event.target.tagName)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) { keyboardHeldRef.current = true; begin(); }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault(); navigate(index + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault(); navigate(index - 1);
      } else if (event.key === 'Escape' && !locked) onClose();
    };
    const keyup = (event) => {
      if (event.code === 'Space' && keyboardHeldRef.current) {
        keyboardHeldRef.current = false;
        event.preventDefault();
        stop();
      }
    };
    const focusTrap = (event) => {
      if (event.key !== 'Tab') return;
      const items = [...document.querySelectorAll('[data-voice-studio] button:not(:disabled), [data-voice-studio] input:not(:disabled):not([hidden])')];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('keydown', focusTrap);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('keydown', focusTrap);
    };
  }, [begin, stop, index, locked, navigate, onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  async function preview() {
    stopPreview();
    const audio = new Audio(recordings[prompt.id].url);
    audioRef.current = audio;
    audio.onended = stopPreview;
    audio.onerror = () => { stopPreview(); setMessage('This browser could not play that recording. Please make a new take.'); };
    try { await audio.play(); if (audioRef.current === audio) setPlaying(true); } catch { stopPreview(); setMessage('Could not play this recording. Try recording it again.'); }
  }

  async function remove() {
    stopPreview();
    try { await deleteRecording(prompt.id); await refresh(); setMessage('Take deleted from the project. You can record a new one.'); }
    catch { setMessage('Could not delete this recording. Please try again.'); }
  }

  async function download() {
    setTransferring(true);
    try {
      const url = URL.createObjectURL(await exportVoicePack());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'alphabet-zoo-my-voice.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Backup downloaded. You can import it into another local copy of the project.');
    } catch { setMessage('Could not export your voice. Please try again.'); }
    finally { setTransferring(false); }
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setTransferring(true);
    stopPreview();
    try {
      const count = await importVoicePack(file);
      await refresh();
      setMessage(`Imported ${count} recordings into the project. Matching takes were replaced.`);
    } catch (issue) { setMessage(issue.message || 'Could not import this backup.'); }
    finally { setTransferring(false); event.target.value = ''; }
  }

  async function copyPrevious() {
    setTransferring(true);
    try {
      const count = await copyLegacyRecordings();
      await refresh();
      setMessage(`${count} earlier browser recording${count === 1 ? '' : 's'} copied into the project.`);
    } catch (issue) { setMessage(issue.message || 'Could not copy the earlier recordings.'); }
    finally { setTransferring(false); }
  }

  async function downloadPrevious() {
    setTransferring(true);
    try {
      const url = URL.createObjectURL(await exportLegacyVoicePack());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'alphabet-zoo-earlier-browser-voice.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Earlier browser recordings downloaded. Import this backup in the local project app.');
    } catch (issue) { setMessage(issue.message || 'Could not download the earlier recordings.'); }
    finally { setTransferring(false); }
  }

  const count = ALPHABET_DATA.filter(({ letter }) => recordings[`phrase-${letter}`]).length;
  return (
    <div className="voice-overlay" data-voice-studio role="dialog" aria-modal="true" aria-labelledby="voice-title">
      <div className="voice-studio">
        <header className="voice-header">
          <div><p className="eyebrow">A familiar voice for every letter</p><h2 id="voice-title">Your voice, their zoo.</h2></div>
          <button ref={closeRef} className="icon-button" onClick={onClose} disabled={busy || transferring} aria-label="Close voice studio"><X size={22} /></button>
        </header>
        <p className="voice-intro">{loading ? 'Loading project voices…' : canEdit ? <>One full sentence for each letter. Hold <kbd>Space</kbd> or the microphone button, say the sentence shown, and release to save it in the project.</> : 'To add recordings, open this app from the project on your computer. Your published game includes the saved voice files.'}</p>
        <div className="voice-progress"><span>{count} of 26 sentences saved</span><span>Letter {index + 1} / 26</span></div>
        <p className="voice-breakdown">{count === 26 ? 'Your whole alphabet is ready!' : `${26 - count} sentences left to record`}</p>
        <progress max="26" value={count} aria-label="Recording progress" />
        <div className="voice-workspace">
          <div className="voice-picture"><AnimalPicture key={prompt.letter} letter={prompt.letter} showCredit /><span>{prompt.letter} · {prompt.animal}</span></div>
          <div className="voice-prompt">
            <div className="voice-prompt-type">{prompt.type} {recordings[prompt.id] && <span><Check size={14} /> Saved</span>}</div>
            <p className="eyebrow">Say this aloud</p>
            <p className="spoken-prompt">“{prompt.text}”</p>
            <button
              className={`record-button ${status === 'recording' ? 'is-recording' : ''}`}
              disabled={!canEdit || (locked && !busy) || status === 'saving'}
              onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); begin(); }}
              onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Hold to record" aria-pressed={status === 'recording'}
            ><Mic size={24} />{status === 'preparing' ? 'Allow microphone, then speak…' : status === 'recording' ? `Recording · ${seconds}s — release to save` : status === 'saving' ? 'Saving your voice…' : recordings[prompt.id] ? 'Hold to record a new take' : 'Hold to record'}</button>
            <p className="record-note">Wait for “Recording” before speaking. Up to 15 seconds per take.</p>
            <div className="voice-take-actions">
              <button onClick={playing ? stopPreview : preview} disabled={locked || !recordings[prompt.id]}><Play size={16} />{playing ? 'Stop playback' : 'Listen to take'}</button>
              <button onClick={remove} disabled={locked || !canEdit || !recordings[prompt.id]} aria-label="Delete this take"><Trash2 size={16} />Delete take</button>
            </div>
          </div>
        </div>
        <div className="voice-status" role="status" aria-live="polite">{error || storageError || (loading ? 'Loading your recordings…' : message)}</div>
        <nav className="voice-navigation" aria-label="Recording prompts">
          <button className="secondary-button" onClick={() => navigate(index - 1)} disabled={locked || index === 0}><ArrowLeft size={17} />Previous</button>
          <button className="primary-button" onClick={index === 25 ? onClose : () => navigate(index + 1)} disabled={locked}>{index === 25 ? 'Back to the zoo' : 'Next sentence'}<ArrowRight size={17} /></button>
        </nav>
        <div className="voice-letter-grid" aria-label="Choose a letter">
          {ALPHABET_DATA.map(({ letter }, letterIndex) => <button key={letter} disabled={locked} onClick={() => navigate(letterIndex)} aria-label={`Record ${letter}`} aria-current={prompt.letter === letter ? 'step' : undefined} className={recordings[`phrase-${letter}`] ? 'complete' : ''}>{letter}</button>)}
        </div>
        <footer className="voice-footer">
          <label className="voice-toggle"><input type="checkbox" checked={enabled} disabled={busy} onChange={(event) => {
            try { setUsesPersonalVoice(event.target.checked); setEnabled(event.target.checked); }
            catch { setMessage('Your browser could not save this preference.'); }
          }} />Use my recordings in the game</label>
          <div className="voice-backups"><button disabled={locked || !count} onClick={download}><Download size={15} />Export backup</button><button disabled={locked || !canEdit} onClick={() => fileRef.current.click()}><Upload size={15} />Import backup</button><input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={upload} /></div>
          {canEdit && legacyCount > 0 && <button className="legacy-copy-button" disabled={locked} onClick={copyPrevious}><Upload size={15} />Copy {legacyCount} earlier browser recording{legacyCount === 1 ? '' : 's'} into project</button>}
          {!canEdit && legacyCount > 0 && <button className="legacy-copy-button" disabled={locked} onClick={downloadPrevious}><Download size={15} />Download {legacyCount} earlier browser recording{legacyCount === 1 ? '' : 's'}</button>}
          <p>{canEdit ? 'Takes are saved as audio files in this project. Publish the updated project to share your voice on other devices. Export backup makes another copy.' : 'These voice files were included when the project was published. Record new takes in the local project app.'} Unrecorded prompts use the original voice.</p>
        </footer>
      </div>
    </div>
  );
}
