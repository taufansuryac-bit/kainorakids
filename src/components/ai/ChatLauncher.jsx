import { lazy, Suspense, useState } from 'react';
import { Terminal } from 'lucide-react';

const Chat = lazy(() => import('./KainoraAI'));
export function ChatLauncher() {
  const [requested, setRequested] = useState(false);
  const launcher = <button type="button" className="ai-launcher fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border-[3px] border-ink bg-brand-yellow px-4 py-3 text-ink shadow-solid-sm sm:bottom-6 sm:right-6" aria-label="Open KAINORA AI Chat" onClick={() => setRequested(true)}><Terminal className="w-5 h-5"/><span className="font-arcade text-xs font-bold tracking-widest">[ TANYA KAINORA ]</span></button>;
  return requested ? <Suspense fallback={launcher}><Chat initialOpen/></Suspense> : launcher;
}
