// Live status for the public page: listens to one Firestore document.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { firebaseConfig, configured } from './firebase-config.js?v=1793453042';

if (configured && !/[?&]preview=/.test(location.search)) {
  const db = getFirestore(initializeApp(firebaseConfig));
  onSnapshot(
    doc(db, 'status', 'current'),
    (snap) => {
      if (window.__applyStatus) { window.__applyStatus(snap.exists() ? snap.data() : null, true); }
    },
    (err) => console.warn('Live updates unavailable', err)
  );
}
