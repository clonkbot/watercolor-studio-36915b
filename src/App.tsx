import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

const WATERCOLOR_STYLES = [
  { id: "classic", name: "Classic", description: "Traditional watercolor with soft washes" },
  { id: "vibrant", name: "Vibrant", description: "Bold, saturated colors" },
  { id: "ethereal", name: "Ethereal", description: "Dreamy, soft pastels" },
  { id: "botanical", name: "Botanical", description: "Detailed nature illustrations" },
  { id: "abstract", name: "Abstract", description: "Loose, expressive strokes" },
];

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Watercolor background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-rose-200/60 via-amber-100/40 to-transparent blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-gradient-to-bl from-sky-200/50 via-teal-100/30 to-transparent blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-gradient-to-tr from-violet-200/40 via-pink-100/30 to-transparent blur-3xl animate-float-slow" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-400 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-slate-800 mb-2">
            Watercolor Studio
          </h1>
          <p className="text-slate-600 font-body">
            Create beautiful AI-powered watercolor illustrations
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-white/50 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all font-body"
                placeholder="artist@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all font-body"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <p className="text-rose-600 text-sm font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 text-white font-semibold shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-body"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                flow === "signIn" ? "Enter Studio" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200/50">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="w-full text-center text-slate-600 hover:text-slate-800 transition-colors font-body text-sm"
            >
              {flow === "signIn" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/70 px-2 text-slate-500 font-body">or</span>
              </div>
            </div>

            <button
              onClick={() => signIn("anonymous")}
              className="w-full py-3 px-6 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 hover:bg-white/50 transition-all font-body"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "error" | "success"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-xl animate-slide-up font-body ${
      type === "error"
        ? "bg-rose-500 text-white"
        : "bg-emerald-500 text-white"
    }`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function GeneratorPanel({ onGenerate }: { onGenerate: (prompt: string, style: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [isGenerating, setIsGenerating] = useState(false);
  const generateImage = useAction(api.ai.generateImage);
  const saveIllustration = useMutation(api.illustrations.create);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const style = WATERCOLOR_STYLES.find(s => s.id === selectedStyle);
    const fullPrompt = `Create a beautiful watercolor illustration: ${prompt}. Style: ${style?.description || "classic watercolor"}. The image should have characteristic watercolor features like soft edges, color bleeding, wet-on-wet effects, visible brush strokes, paper texture, and translucent color layers. Make it artistic and painterly.`;

    try {
      const result = await generateImage({ prompt: fullPrompt });
      if (result) {
        await saveIllustration({
          prompt: prompt,
          imageBase64: result,
          style: selectedStyle,
        });
        onGenerate(prompt, selectedStyle);
        setPrompt("");
        setToast({ message: "Illustration created!", type: "success" });
      } else {
        setToast({ message: "Failed to generate image. Please try again.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 md:p-8 shadow-xl shadow-slate-200/30 border border-white/60">
        <h2 className="font-display text-2xl md:text-3xl text-slate-800 mb-6">
          Create Your Painting
        </h2>

        <div className="space-y-6">
          {/* Style selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 font-body">
              Watercolor Style
            </label>
            <div className="flex flex-wrap gap-2">
              {WATERCOLOR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-4 py-2.5 rounded-xl font-body text-sm transition-all ${
                    selectedStyle === style.id
                      ? "bg-gradient-to-r from-rose-400 to-amber-400 text-white shadow-lg shadow-rose-200/50"
                      : "bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 font-body">
              Describe Your Vision
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene Japanese garden with cherry blossoms falling into a koi pond..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all font-body resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 text-white font-semibold text-lg shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-body"
          >
            {isGenerating ? (
              <span className="inline-flex items-center justify-center gap-3">
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Painting in progress...</span>
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Create Watercolor
              </span>
            )}
          </button>
        </div>

        {/* Generating animation */}
        {isGenerating && (
          <div className="mt-8 relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Watercolor paint drops animation */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-rose-300/40 blur-xl animate-paint-drop" />
                  <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-amber-300/40 blur-xl animate-paint-drop" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-4 -left-4 w-14 h-14 rounded-full bg-sky-300/40 blur-xl animate-paint-drop" style={{ animationDelay: "1s" }} />
                  <div className="absolute top-2 left-4 w-10 h-10 rounded-full bg-teal-300/40 blur-xl animate-paint-drop" style={{ animationDelay: "1.5s" }} />

                  <div className="text-center relative z-10">
                    <div className="inline-flex items-center gap-1 mb-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <p className="text-slate-600 font-body text-sm">Mixing colors...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function GalleryItem({ illustration, onDelete }: {
  illustration: {
    _id: Id<"illustrations">;
    prompt: string;
    imageBase64: string;
    createdAt: number;
    style?: string;
  };
  onDelete: (id: Id<"illustrations">) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = WATERCOLOR_STYLES.find(s => s.id === illustration.style);

  return (
    <>
      <div
        className="group relative bg-white/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-slate-300/30 transition-all cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={`data:image/png;base64,${illustration.imageBase64}`}
            alt={illustration.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-body text-sm line-clamp-2">{illustration.prompt}</p>
            {style && (
              <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-body">
                {style.name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(illustration._id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-rose-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Expanded modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`data:image/png;base64,${illustration.imageBase64}`}
              alt={illustration.prompt}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="p-6">
              <p className="text-slate-800 font-body">{illustration.prompt}</p>
              <div className="flex items-center gap-4 mt-4">
                {style && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-body">
                    {style.name}
                  </span>
                )}
                <span className="text-slate-500 text-sm font-body">
                  {new Date(illustration.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center justify-center shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Gallery() {
  const illustrations = useQuery(api.illustrations.list);
  const deleteIllustration = useMutation(api.illustrations.remove);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleDelete = async (id: Id<"illustrations">) => {
    try {
      await deleteIllustration({ id });
      setToast({ message: "Illustration deleted", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  if (illustrations === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (illustrations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-1 mb-4">
          <div className="w-4 h-4 rounded-full bg-rose-200" />
          <div className="w-4 h-4 rounded-full bg-amber-200" />
          <div className="w-4 h-4 rounded-full bg-sky-200" />
        </div>
        <h3 className="font-display text-2xl text-slate-700 mb-2">No paintings yet</h3>
        <p className="text-slate-500 font-body">Create your first watercolor illustration above!</p>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {illustrations.map((illustration: { _id: Id<"illustrations">; prompt: string; imageBase64: string; createdAt: number; style?: string }) => (
          <GalleryItem
            key={illustration._id}
            illustration={illustration}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}

function MainApp() {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen relative">
      {/* Watercolor background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-100/80 via-amber-50/60 to-transparent blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-sky-100/70 via-teal-50/50 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-violet-100/60 via-pink-50/40 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-amber-100/50 via-rose-50/30 to-transparent blur-3xl" />
      </div>

      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-sky-400" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-slate-800">
              Watercolor Studio
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            className="px-5 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-md transition-all font-body text-sm"
          >
            Sign Out
          </button>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <GeneratorPanel onGenerate={() => {}} />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-5 md:p-8 border border-white/60">
              <h2 className="font-display text-2xl md:text-3xl text-slate-800 mb-6">
                Your Gallery
              </h2>
              <Gallery />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <p className="text-slate-400 text-xs font-body">
            Requested by @OxPaulius · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-400 animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-slate-600 font-body">Loading studio...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <AuthScreen />;
}
