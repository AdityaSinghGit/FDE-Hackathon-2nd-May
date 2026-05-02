import type { Mode } from "../hooks/useTriage";

interface HeaderProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onClear?: () => void;
  apiKey: string;
  onOpenSettings: () => void;
}

export function Header({ mode, setMode, apiKey, onOpenSettings }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="title-row">
          <h1 className="app-title">
            <span className="gradient-text">Symptom Triage</span> Assistant
          </h1>
          <div className="api-settings">
            <button 
              type="button" 
              className={`api-toggle ${apiKey ? 'has-key' : ''}`}
              onClick={onOpenSettings}
              title={apiKey ? "AI Configured" : "AI Configuration Required"}
            >
              {apiKey ? "⚙️ Settings" : "🔑 Setup AI"}
            </button>
          </div>
        </div>
        <p className="app-sub">
          Informational guidance only — not a diagnosis. Share symptoms safely;
          street address for clinics is kept off the AI chat path.
        </p>
      </div>
      <nav className="mode-tabs" aria-label="Input mode">
        <button
          type="button"
          data-active={mode === "chat"}
          onClick={() => setMode("chat")}
          className="tab-btn"
        >
          <span className="tab-icon">💬</span> Chat
        </button>
        <button
          type="button"
          data-active={mode === "form"}
          onClick={() => setMode("form")}
          className="tab-btn"
        >
          <span className="tab-icon">📝</span> Form
        </button>
      </nav>
    </header>
  );
}
