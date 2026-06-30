import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// ─── Persona Definitions & Terminology Dictionaries ──────────────────────────
type PersonaKey = 'default' | 'dexter' | 'breaking-bad' | 'patrick-jane' | 'sherlock' | 'goku' | 'aot';

interface PersonaInfo {
  name: string;
  className: string;
  quote: string;
  accentColor: string;
  terms: {
    tasks: string;
    categories: string;
    notes: string;
    completed: string;
    focusMode: string;
    timer: string;
    trash: string;
  };
}

const personas: Record<PersonaKey, PersonaInfo> = {
  default: {
    name: 'Clean & Modern (Default)',
    className: '',
    quote: 'Keep your tasks clean, modern, and focused.',
    accentColor: '#10b981',
    terms: {
      tasks: 'Tasks',
      categories: 'Categories',
      notes: 'Notes',
      completed: 'Completed',
      focusMode: 'Focus Mode',
      timer: 'Timer',
      trash: 'Trash Bin',
    },
  },
  dexter: {
    name: 'Dexter Morgan',
    className: 'persona-dexter',
    quote: "Tonight's the night. Everything is calculated, clean, and in order.",
    accentColor: '#ef4444',
    terms: {
      tasks: 'Cases',
      categories: 'Evidence Files',
      notes: 'Observations',
      completed: 'Blood Slides',
      focusMode: 'Kill Room',
      timer: 'Ritual Timer',
      trash: 'Deep Ocean',
    },
  },
  'breaking-bad': {
    name: 'Walter White / Heisenberg',
    className: 'persona-breaking-bad',
    quote: "Say my name. We are in the empire business, and the chemistry must be respected.",
    accentColor: '#06b6d4',
    terms: {
      tasks: 'Batches',
      categories: 'Chemical Prep',
      notes: 'Lab Log',
      completed: 'Pure Product',
      focusMode: 'Superlab',
      timer: 'Reaction Timer',
      trash: 'Acid Vat',
    },
  },
  'patrick-jane': {
    name: 'Patrick Jane',
    className: 'persona-patrick-jane',
    quote: 'There is always a tell. Focus, perceive, and let the mind solve the mystery.',
    accentColor: '#d97706',
    terms: {
      tasks: 'Clues',
      categories: 'CBI Files',
      notes: 'Hypnotic Log',
      completed: 'Cases Solved',
      focusMode: 'CBI HQ',
      timer: 'Tea Break',
      trash: 'Discarded Leads',
    },
  },
  sherlock: {
    name: 'Sherlock Holmes',
    className: 'persona-sherlock',
    quote: 'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    accentColor: '#1d4ed8',
    terms: {
      tasks: 'Inquiries',
      categories: 'Deductions',
      notes: 'Journal',
      completed: 'Solved Cases',
      focusMode: 'Mind Palace',
      timer: 'Focus Hour',
      trash: 'Ignored Noise',
    },
  },
  goku: {
    name: 'Son Goku',
    className: 'persona-goku',
    quote: 'I want to fight someone strong! Push your limits and train harder than yesterday.',
    accentColor: '#facc15',
    terms: {
      tasks: 'Training',
      categories: 'Gravity Settings',
      notes: 'Power Log',
      completed: 'Powering Up',
      focusMode: 'Gravity Chamber',
      timer: 'Training Interval',
      trash: 'Wasted Effort',
    },
  },
  aot: {
    name: 'Captain Levi',
    className: 'persona-aot',
    quote: 'Dedicate your heart. Clean up this mess, follow orders, and strike down the enemy.',
    accentColor: '#10b981',
    terms: {
      tasks: 'Expeditions',
      categories: 'Squad Orders',
      notes: 'Survey Log',
      completed: 'Titans Slain',
      focusMode: 'Survey Corps',
      timer: 'Scout Alert',
      trash: 'Graveyard',
    },
  },
};

function App() {
  const [activePersona, setActivePersona] = useState<PersonaKey>('default');
  const [testText, setTestText] = useState('');
  const [focusState, setFocusState] = useState(false);

  // Apply the active persona's class to the document body
  useEffect(() => {
    // Remove all previous persona classes
    Object.values(personas).forEach((p) => {
      if (p.className) {
        document.body.classList.remove(p.className);
      }
    });

    // Add current persona class
    const current = personas[activePersona];
    if (current && current.className) {
      document.body.classList.add(current.className);
    }
  }, [activePersona]);

  const triggerCelebration = () => {
    const current = personas[activePersona];
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: [current.accentColor, '#ffffff', '#a8a29e'],
    });
  };

  const selectedPersona = personas[activePersona];

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dexter blood drip overlay effect */}
      {activePersona === 'dexter' && (
        <>
          <div className="blood-drip" style={{ left: '10%', animationDelay: '0s' }}></div>
          <div className="blood-drip" style={{ left: '25%', animationDelay: '0.8s' }}></div>
          <div className="blood-drip" style={{ left: '60%', animationDelay: '0.3s' }}></div>
          <div className="blood-drip" style={{ left: '80%', animationDelay: '1.2s' }}></div>
        </>
      )}

      <div className="max-w-4xl w-full flex flex-col gap-8 z-10">
        {/* Header Title Section */}
        <div className="text-center">
          <p className="label-muted mb-2">Workspace & Persona Architecture</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            {activePersona === 'breaking-bad' ? (
              <span>
                <span className="inline-block border border-primary px-2 bg-black/40 mr-1 text-primary">Ca</span>seThread
              </span>
            ) : (
              'CaseThread'
            )}
          </h1>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
            Design Token & Framework Verification Panel (Day 6 Scaffolding validation). Fully responsive, modular layouts with premium aesthetics.
          </p>
        </div>

        {/* Live Persona Switcher Panel */}
        <div className="glass p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Select Active Character Persona</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {(Object.keys(personas) as PersonaKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActivePersona(key)}
                className={`px-3 py-2 text-xs rounded-lg font-semibold transition-all border ${
                  activePersona === key
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'border-white/10 hover:border-white/30 text-muted'
                }`}
              >
                {key.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-2 p-4 rounded bg-black/20 border border-white/5">
            <p className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Active Vibe & Quote</p>
            <p className="font-semibold text-lg">{selectedPersona.name}</p>
            <p className="italic text-muted mt-1">"{selectedPersona.quote}"</p>
          </div>
        </div>

        {/* Testing / Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Terminology & Core Design Elements */}
          <div className="glass p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Dynamic Terminology</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 label-muted">Standard term</th>
                    <th className="pb-2 label-muted">Mapped persona term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 text-muted">Tasks</td>
                    <td className="py-2 font-bold text-primary">{selectedPersona.terms.tasks}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Categories</td>
                    <td className="py-2 font-bold">{selectedPersona.terms.categories}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Notes</td>
                    <td className="py-2 font-bold">{selectedPersona.terms.notes}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Completed</td>
                    <td className="py-2 font-bold text-accent">{selectedPersona.terms.completed}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Focus Mode</td>
                    <td className="py-2 font-bold">{selectedPersona.terms.focusMode}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Timer</td>
                    <td className="py-2 font-bold">{selectedPersona.terms.timer}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted">Trash</td>
                    <td className="py-2 font-bold">{selectedPersona.terms.trash}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Input Field Styling</h2>
              <input
                type="text"
                className="input-field"
                placeholder={`Search ${selectedPersona.terms.tasks.toLowerCase()}...`}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
              />
              {testText && (
                <p className="text-xs text-muted mt-2">
                  Searching for: <span className="font-semibold text-primary">{testText}</span>
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Button Elements & Visual FX */}
          <div className="glass p-6 flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Action Elements & Verification</h2>
              <p className="text-sm text-muted">
                Test the primary button color blend, hover transitions, and canvas-confetti initialization.
              </p>

              <div className="flex flex-wrap gap-3">
                <button className="btn-primary" onClick={triggerCelebration}>
                  Mark Done 🎉
                </button>
                <button className="btn-ghost" onClick={() => setFocusState(!focusState)}>
                  Toggle Tunnel Vision
                </button>
              </div>

              {/* Tunnel Vision demo */}
              <div className="mt-4 p-4 border border-white/10 rounded-lg">
                <p className="text-xs label-muted mb-2">Focus Mode Demo</p>
                <div className="flex flex-col gap-2">
                  <div className="p-2 bg-white/5 rounded text-sm font-semibold">
                    ⭐ Focus Task: Complete full pipeline validation
                  </div>
                  <div className={`p-2 bg-white/5 rounded text-xs text-muted ${focusState ? 'focus-mode-dimmed' : ''}`}>
                    Muted Task: Unrelated secondary task item
                  </div>
                  <div className={`p-2 bg-white/5 rounded text-xs text-muted ${focusState ? 'focus-mode-dimmed' : ''}`}>
                    Muted Task: Another backburner activity
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Skeleton Loader Effect</h2>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-3/4 skeleton"></div>
                <div className="h-3 w-1/2 skeleton"></div>
                <div className="h-3 w-5/6 skeleton"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="text-center text-xs text-muted">
          <p>
            Vite React TS + Tailwind CSS v4 setup verified successfully.
          </p>
          <p className="mt-1">
            CaseThread Architecture System • Day 6 Done
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
