import React, { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../../firebase';
import { Bell, X } from 'lucide-react';

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    // Cek apakah browser mendukung notifikasi dan apakah belum diizinkan
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        // Tampilkan prompt setelah beberapa detik agar tidak terlalu mengganggu
        const timer = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    // Dengarkan pesan masuk saat aplikasi sedang dibuka (foreground)
    if (Notification.permission === 'granted') {
      onMessageListener()
        .then((payload) => {
          setNotification({
            title: payload?.notification?.title,
            body: payload?.notification?.body,
          });
          // Tampilkan toast atau alert kustom di sini
          console.log('Received foreground message: ', payload);
        })
        .catch((err) => console.log('failed: ', err));
    }
  }, []);

  const handleAllow = async () => {
    setShowPrompt(false);
    const token = await requestForToken();
    if (token) {
      console.log('Berhasil mendapatkan token notifikasi FCM');
      // Di sistem nyata, token ini harus dikirim ke database untuk disimpan
    }
  };

  const handleDecline = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-[100] border-b border-gray-800 animate-slide-down">
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-oswald text-sm font-bold uppercase tracking-widest text-white">Dapatkan Info Promo Khusus!</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Izinkan notifikasi untuk diskon rahasia dan info baju anak terbaru.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2 border border-gray-700 text-gray-300 font-oswald text-xs font-bold uppercase tracking-widest hover:text-white hover:border-gray-500 transition-colors"
          >
            Nanti Saja
          </button>
          <button 
            onClick={handleAllow}
            className="flex-1 md:flex-none px-6 py-2 bg-amber-500 text-gray-900 font-oswald text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-colors"
          >
            Ya, Izinkan!
          </button>
          <button onClick={handleDecline} className="hidden md:block text-gray-500 hover:text-white ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
