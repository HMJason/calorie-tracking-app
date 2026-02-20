'use client';

import ImageUpload from '@/components/ImageUpload';

export default function LogFoodPage() {
  return (
    <>
      <div className="page-header animate-fade-in-up">
        <p className="page-header-eyebrow">AI-Powered</p>
        <h1>Log Food</h1>
        <p>Snap a photo of your meal and let AI handle the nutrition tracking.</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="panel animate-fade-in-up delay-1">
          <div className="panel-title">
            <div className="panel-title-dot" />
            Upload Food Image
          </div>
          <ImageUpload />
        </div>

        {/* Tips panel */}
        <div
          className="panel animate-fade-in-up delay-2"
          style={{
            marginTop: 'var(--space-5)',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(124,58,237,0.08))',
            borderColor: 'rgba(6,182,212,0.25)',
          }}
        >
          <div className="panel-title">
            <div className="panel-title-dot" style={{ background: 'var(--accent-cyan)' }} />
            Tips for Best Results
          </div>
          <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li>Use good lighting — natural daylight is best.</li>
            <li>Capture the entire plate so AI can identify all items.</li>
            <li>Avoid angled or blurry shots for higher accuracy.</li>
            <li>Include any sauces or toppings in the frame.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
