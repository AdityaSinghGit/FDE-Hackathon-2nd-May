import "./Landing.css";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="landing-overlay animate-fade-in">
      <div className="landing-content">
        <header className="landing-header">
          <div className="logo-pill">
            <span className="logo-icon">🧬</span>
            <span className="logo-text">PulseCheck AI</span>
          </div>
        </header>

        <main className="landing-hero">
          <div className="hero-text-block">
            <h1 className="hero-title">
              The Future of <span className="text-gradient">Personal Health</span> Triage
            </h1>
            <p className="hero-subtitle">
              Understand your symptoms, decode complex medical reports, and find nearby 
              care—all in one secure, AI-powered platform.
            </p>
            
            <div className="hero-cta-group">
              <button className="btn-primary-large" onClick={onStart}>
                Launch Assistant
                <span className="btn-icon">→</span>
              </button>
              <p className="hero-hint">No credit card required. Private & Encrypted.</p>
            </div>
          </div>

          <div className="hero-visual-block">
            <div className="visual-card-float">
              <img 
                src="/medical_ai_landing_hero_1777722714937.png" 
                alt="AI Dashboard Preview" 
                className="hero-image"
              />
              <div className="glass-overlay" />
            </div>
          </div>
        </main>

        <div className="landing-stats">
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Model Uptime</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Instant</span>
            <span className="stat-label">Report Decode</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Private</span>
            <span className="stat-label">Data Privacy</span>
          </div>
        </div>

        <section className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Smart Triage</h3>
            <p>Conversational intake that understands urgency and provides clinical context based on your inputs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Report Simplifier</h3>
            <p>Upload lab results or reports to translate medical jargon into plain English for better understanding.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Clinic Discovery</h3>
            <p>Integrated MCP search to find verified medical facilities near your location without sharing data with AI.</p>
          </div>
        </section>

        <section className="security-banner">
          <div className="security-icon-large">🛡️</div>
          <h2>Bank-Grade Privacy</h2>
          <p>
            Your health data is sensitive. We use client-side encryption and 
            never store your personal identification. Address data is processed 
            locally for clinic searches and is never sent to the LLM.
          </p>
        </section>

        <footer className="landing-footer">
          <p>© 2026 PulseCheck AI • Built with Gemini 2.0 Flash for the FDE Hackathon</p>
        </footer>
      </div>
    </div>
  );
}
