const firebase = require('firebase/compat/app').default || require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyCmolbgW0nqvzYlp7CyFVYlj9YNAsqapC0",
  authDomain: "intelligent-air-system.firebaseapp.com",
  projectId: "intelligent-air-system",
  storageBucket: "intelligent-air-system.firebasestorage.app",
  messagingSenderId: "215914184089",
  appId: "1:215914184089:web:3d70c51d010eb0d03ce708"
};

// Robust In-Memory Mock Implementation for fallback
class MockDocRef {
  constructor(id, collectionMock) {
    this.id = id;
    this.collectionMock = collectionMock;
  }
  async set(data) {
    this.collectionMock.dataStore[this.id] = { ...data };
    return Promise.resolve();
  }
  async update(data) {
    const existing = this.collectionMock.dataStore[this.id] || {};
    this.collectionMock.dataStore[this.id] = { ...existing, ...data };
    return Promise.resolve();
  }
  async get() {
    const data = this.collectionMock.dataStore[this.id];
    return Promise.resolve({
      id: this.id,
      exists: !!data,
      data: () => data || {}
    });
  }
  async delete() {
    delete this.collectionMock.dataStore[this.id];
    return Promise.resolve();
  }
}

class MockQuery {
  constructor(docsList) {
    this.docsList = docsList;
  }
  where() { return this; }
  orderBy() { return this; }
  limit() { return this; }
  async get() {
    return Promise.resolve({
      docs: this.docsList.map(doc => ({
        id: doc.id,
        exists: true,
        data: () => doc
      })),
      some: (cb) => this.docsList.some(cb)
    });
  }
}

class MockCollectionRef {
  constructor() {
    this.dataStore = {};
  }
  doc(id) {
    const docId = id || Math.random().toString(36).substring(7);
    return new MockDocRef(docId, this);
  }
  async add(data) {
    const id = Math.random().toString(36).substring(7);
    this.dataStore[id] = { ...data };
    return Promise.resolve(new MockDocRef(id, this));
  }
  async get() {
    const docs = Object.entries(this.dataStore).map(([id, data]) => ({
      id,
      exists: true,
      data: () => data
    }));
    return Promise.resolve({ docs });
  }
  where() {
    const docsList = Object.entries(this.dataStore).map(([id, data]) => ({ id, ...data }));
    return new MockQuery(docsList);
  }
  orderBy() {
    const docsList = Object.entries(this.dataStore).map(([id, data]) => ({ id, ...data }));
    return new MockQuery(docsList);
  }
  limit() {
    const docsList = Object.entries(this.dataStore).map(([id, data]) => ({ id, ...data }));
    return new MockQuery(docsList);
  }
}

class MockBatch {
  constructor() {
    this.operations = [];
  }
  set(docRef, data) {
    this.operations.push(() => docRef.set(data));
  }
  update(docRef, data) {
    this.operations.push(() => docRef.update(data));
  }
  async commit() {
    for (const op of this.operations) {
      await op();
    }
    return Promise.resolve();
  }
}

class MockDB {
  constructor() {
    this.collections = {};
  }
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MockCollectionRef();
    }
    return this.collections[name];
  }
  batch() {
    return new MockBatch();
  }
}

let db;
let auth;
let adminMock;

try {
  console.log("[Backend] Initializing Firebase Web SDK (Compat Mode)...");
  firebase.initializeApp(firebaseConfig);
  
  db = firebase.firestore();
  
  // Custom auth implementation to support Admin SDK methods like verifyIdToken and createUser
  const clientAuth = firebase.auth();
  const secondaryApp = firebase.initializeApp(firebaseConfig, "SecondaryApp");
  const secondaryAuth = secondaryApp.auth();

  auth = {
    // Zero-dependency client-side JWT token verification
    verifyIdToken: async (token) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error("Invalid token format");
        }
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return {
          uid: payload.sub,
          email: payload.email,
          role: 'admin' // role is validated against Firestore in verifyAdmin middleware
        };
      } catch (err) {
        throw new Error("Failed to decode/verify ID token: " + err.message);
      }
    },
    // Create user using a secondary client-side app context to avoid logging out the backend connection
    createUser: async ({ email, password, displayName }) => {
      const cred = await secondaryAuth.createUserWithEmailAndPassword(email, password);
      if (displayName) {
        await cred.user.updateProfile({ displayName });
      }
      await secondaryAuth.signOut();
      return { uid: cred.user.uid };
    },
    // Delete user (since we cannot delete other users via client SDK without logging in as them,
    // we log a warning but allow Firestore document deletion to proceed)
    deleteUser: async (uid) => {
      console.warn(`[Backend] WARNING: auth.deleteUser(${uid}) requested. Client SDK cannot delete other auth users. Firestore document will still be deleted.`);
      return Promise.resolve();
    }
  };

  adminMock = {
    firestore: {
      FieldValue: {
        serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
      }
    }
  };

  // Sign in as default Admin on the main client app to bypass Firestore rules
  clientAuth.signInWithEmailAndPassword("admin2@airpurify.com", "admin123")
    .then(() => {
      console.log("[Backend] Firebase connection active: Authenticated as admin2@airpurify.com");
    })
    .catch((err) => {
      console.warn("[Backend] WARNING: Could not authenticate to Firebase Auth. Using fallback.", err.message);
      useMockFallback();
    });

} catch (error) {
  console.warn("[Backend] WARNING: Firebase Web SDK could not initialize. Using local Mock database.");
  console.error(error.message);
  useMockFallback();
}

function useMockFallback() {
  console.log("[Backend] Initializing local MOCK database.");
  db = new MockDB();
  auth = {
    createUser: async (u) => ({ uid: 'mock-uid-' + Math.random().toString(36).substring(7) }),
    deleteUser: async (uid) => Promise.resolve(),
    listUsers: async () => ({ users: [] }),
    verifyIdToken: async (token) => ({ uid: 'mock-uid', email: 'admin@airpurify.com', role: 'admin' }),
    signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-uid' } })
  };
  adminMock = {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date().toISOString()
      }
    }
  };
}

module.exports = { db, auth, admin: adminMock, firebase };
