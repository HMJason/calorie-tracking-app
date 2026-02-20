'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

type UploadState = 'idle' | 'dragging' | 'preview' | 'analyzing' | 'done' | 'error';

interface MockNutrients {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Demo result shown while backend is not yet connected
const DEMO_RESULT: MockNutrients = {
  name: 'Detected: Grilled Chicken Bowl',
  calories: 540,
  protein: 44,
  carbs: 52,
  fat: 16,
};

export default function ImageUpload() {
  const [state, setState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<MockNutrients | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setState('preview');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState('dragging');
  };

  const handleDragLeave = () => setState('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    setState('analyzing');
    // Simulate AI analysis delay (replace with real API call: analyzeFoodImage(file))
    await new Promise((r) => setTimeout(r, 2000));
    setResult(DEMO_RESULT);
    setState('done');
  };

  const handleReset = () => {
    setState('idle');
    setPreview(null);
    setFileName('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-label="Upload food image"
      />

      {/* Drop Zone / Preview */}
      {state === 'idle' || state === 'dragging' ? (
        <div
          className={`upload-zone ${state === 'dragging' ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Drop food image here or click to browse"
        >
          <div className="upload-zone-icon">
            <Upload size={28} color="var(--accent-purple)" />
          </div>
          <p className="upload-zone-title">
            {state === 'dragging' ? 'Drop it here!' : 'Drag & drop your food photo'}
          </p>
          <p className="upload-zone-sub">or click to browse • PNG, JPG, WEBP supported</p>
        </div>
      ) : (
        /* Preview state */
        preview && (
          <div className="upload-preview">
            <img src={preview} alt="Food preview" />
            <div className="upload-preview-overlay">
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                {fileName}
              </span>
            </div>
            {/* Remove button */}
            <button
              onClick={handleReset}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
              }}
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )
      )}

      {/* Action buttons */}
      {(state === 'preview' || state === 'analyzing') && (
        <Button
          variant="primary"
          icon={state === 'analyzing' ? undefined : <Sparkles size={16} />}
          loading={state === 'analyzing'}
          onClick={handleAnalyze}
          style={{ width: '100%' }}
        >
          {state === 'analyzing' ? 'Analyzing…' : 'Analyze Food'}
        </Button>
      )}

      {/* Result card */}
      {state === 'done' && result && (
        <div
          className="panel animate-scale-in"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.10))',
            borderColor: 'rgba(16,185,129,0.30)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <CheckCircle2 size={20} color="var(--accent-green)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.name}</span>
            <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
              AI Result
            </span>
          </div>

          {/* Macro grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {[
              { label: 'Calories', value: `${result.calories}`, color: 'var(--accent-purple)' },
              { label: 'Protein',  value: `${result.protein}g`,  color: 'var(--accent-cyan)'  },
              { label: 'Carbs',    value: `${result.carbs}g`,    color: 'var(--accent-green)' },
              { label: 'Fat',      value: `${result.fat}g`,      color: 'var(--accent-amber)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              background: 'rgba(245,158,11,0.10)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245,158,11,0.20)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <AlertCircle size={14} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)' }}>
              Demo mode — connect backend for real AI analysis
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="primary" size="sm" style={{ flex: 1 }}>
              Log This Meal
            </Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Try Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
