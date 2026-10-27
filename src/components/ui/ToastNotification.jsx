import {useStore} from '../../context/StoreContext';
import {Star,X} from 'lucide-react';
export const ToastNotification = () => {
  const { toastMessage, showToast } = useStore();
  if (!toastMessage) return null;
  return (
    <div className="fixed top-6 left-0 right-0 z-[5000] flex justify-center pointer-events-none">
      <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-4 border-gray-900 font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-4 animate-toast pointer-events-auto">
        <div className="bg-amber-500 p-2 rounded-full text-white"><Star size={16} fill="currentColor"/></div>
        <span>{toastMessage}</span>
        <button onClick={() => showToast(null)} className="ml-2 hover:text-brand-red transition-colors p-1"><X size={16} strokeWidth={3}/></button>
      </div>
    </div>
  );
};

// --- 4.4 EDIT PROFILE MODAL ---
