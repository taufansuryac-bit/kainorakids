// Read only persistence metadata. Never return or log the saved account or token.
export async function hasSavedBuyerSession() {
  try {
    if (localStorage.getItem('kainora-buyer-session') === 'present' || Object.keys(localStorage).some(key => key.startsWith('firebase:authUser:'))) return true;
    if (!globalThis.indexedDB?.databases) return true;
    const databases = await indexedDB.databases();
    if (!databases.some(database => database.name === 'firebaseLocalStorageDb')) return false;
    return await new Promise(resolve => {
      const request = indexedDB.open('firebaseLocalStorageDb');
      request.onerror = () => resolve(true);
      request.onupgradeneeded = () => {request.transaction.abort();resolve(false);};
      request.onsuccess = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains('firebaseLocalStorage')) {database.close();resolve(false);return;}
        const transaction = database.transaction('firebaseLocalStorage','readonly');
        const keys = transaction.objectStore('firebaseLocalStorage').getAllKeys();
        keys.onsuccess = () => resolve(keys.result.some(key => String(key).startsWith('firebase:authUser:')));
        keys.onerror = () => resolve(true);
        transaction.oncomplete = () => database.close();
        transaction.onabort = () => {database.close();resolve(true);};
      };
    });
  } catch { return true; }
}
