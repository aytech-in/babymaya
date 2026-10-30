// Web app config from Firebase console (Project settings > General > Your apps).
// These values are not secrets. Access is controlled by firestore.rules and your login.
export const firebaseConfig = {
  apiKey: 'AIzaSyDYf5XDIl4vnCPdcZpD_IbkkSDeTK199XA',
  authDomain: 'baby-aytekin.firebaseapp.com',
  projectId: 'baby-aytekin',
  appId: '1:585263710496:web:303e673e6b951cf521d745'
};

// False until you replace the placeholders above.
export const configured = !/^YOUR_/.test(firebaseConfig.apiKey);
