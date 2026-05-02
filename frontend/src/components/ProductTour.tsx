import { useState, useEffect } from "react";
import "./ProductTour.css";

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "main-content",
    title: "Welcome to PulseCheck AI",
    content: "Let's take a quick 1-minute tour to see how you can get the most out of your health assistant.",
    position: "center"
  },
  {
    targetId: "triage-app-address",
    title: "Localized Care",
    content: "Enter your address here to find nearby clinics. This data is private and is NEVER sent to the AI.",
    position: "bottom"
  },
  {
    targetId: "mode-tabs",
    title: "Choose Your Style",
    content: "Switch between a conversational 'Chat' or a structured 'Form' for your symptoms intake.",
    position: "bottom"
  },
  {
    targetId: "composer-textarea",
    title: "Detailed Analysis",
    content: "Describe your symptoms or upload a medical report. Our AI will decode jargon and assess urgency.",
    position: "top"
  },
  {
    targetId: "dashboard-view",
    title: "Intelligent Dashboard",
    content: "Your results, urgency levels, and possible conditions will appear here in real-time.",
    position: "left"
  },
  {
    targetId: "api-settings-trigger",
    title: "Bring Your Own Key",
    content: "Use the settings gear to add your own OpenRouter API key for unlimited, high-speed triage.",
    position: "bottom"
  }
];

interface ProductTourProps {
  onComplete: () => void;
}

export function ProductTour({ onComplete }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: "50%", left: "50%" });

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (step.position === "center") {
      setCoords({ top: "50%", left: "50%" });
      return;
    }

    const target = document.getElementById(step.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      
      const updatePosition = () => {
        const rect = target.getBoundingClientRect();
        let t = rect.top + rect.height / 2;
        let l = rect.left + rect.width / 2;

        if (step.position === "bottom") {
          t = rect.bottom + 20;
          // If off bottom, flip to top
          if (t + 200 > window.innerHeight) t = rect.top - 220;
        } else if (step.position === "top") {
          t = rect.top - 220;
          // If off top, flip to bottom
          if (t < 20) t = rect.bottom + 20;
        } else if (step.position === "left") {
          l = rect.left - 340;
          if (l < 20) l = rect.right + 20;
        } else if (step.position === "right") {
          l = rect.right + 20;
          if (l + 320 > window.innerWidth) l = rect.left - 340;
        }

        // Clamp to screen bounds
        t = Math.max(20, Math.min(t, window.innerHeight - 250));
        l = Math.max(20, Math.min(l, window.innerWidth - 340));

        setCoords({ top: `${t}px`, left: `${l}px` });
      };

      // Delay a bit for scroll to finish
      const timer = setTimeout(updatePosition, 500);
      target.classList.add("tour-highlight");
      
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        clearTimeout(timer);
        target.classList.remove("tour-highlight");
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [currentStep, step.targetId, step.position]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="tour-overlay">
      <div 
        className={`tour-card tour-pos-${step.position}`}
        style={{ top: coords.top, left: coords.left }}
      >
        <div className="tour-progress">
          Step {currentStep + 1} of {TOUR_STEPS.length}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }} 
            />
          </div>
        </div>
        
        <h3>{step.title}</h3>
        <p>{step.content}</p>
        
        <div className="tour-actions">
          <button className="btn-skip" onClick={onComplete}>Skip Tour</button>
          <button className="btn-next" onClick={handleNext}>
            {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next →"}
          </button>
        </div>

        <div className="tour-arrow" />
      </div>
    </div>
  );
}
