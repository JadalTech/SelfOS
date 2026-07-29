/**
 * Firebase Shared Mock Suite
 * SelfOS Testing Infrastructure
 */

export class MockFirestoreDocument {
  constructor(public id: string, private dataObj: Record<string, any>) {}

  exists(): boolean {
    return Boolean(this.dataObj && Object.keys(this.dataObj).length > 0);
  }

  data(): Record<string, any> {
    return { ...this.dataObj };
  }
}

export class MockFirestoreDb {
  private collections: Map<string, Map<string, any>> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    const store = this.collections.get(name)!;

    return {
      doc: (docId?: string) => {
        const id = docId || `doc_${Math.random().toString(36).substring(2, 9)}`;
        return {
          id,
          get: async () => {
            const data = store.get(id);
            return new MockFirestoreDocument(id, data || null);
          },
          set: async (data: any) => store.set(id, data),
          update: async (data: any) => store.set(id, { ...store.get(id), ...data }),
          delete: async () => store.delete(id),
        };
      },
      get: async () => {
        const docs = Array.from(store.entries()).map(([id, d]) => new MockFirestoreDocument(id, d));
        return {
          docs,
          empty: docs.length === 0,
          size: docs.length,
          forEach: (cb: (doc: any) => void) => docs.forEach(cb),
        };
      },
    };
  }

  clear() {
    this.collections.clear();
  }
}

export function createMockFirebaseAuth(initialUser: any = null) {
  let currentUser = initialUser;
  const listeners: Set<(user: any) => void> = new Set();

  return {
    get currentUser() {
      return currentUser;
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      listeners.add(callback);
      callback(currentUser);
      return () => listeners.delete(callback);
    },
    signInWithEmailAndPassword: async (email: string) => {
      currentUser = { uid: 'mock_uid_123', email };
      listeners.forEach((l) => l(currentUser));
      return { user: currentUser };
    },
    signOut: async () => {
      currentUser = null;
      listeners.forEach((l) => l(null));
    },
  };
}
