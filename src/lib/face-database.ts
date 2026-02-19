// Face Database using IndexedDB
export interface StoredFace {
  id: string;
  imageData: string; // Base64 encoded image
  descriptor: number[]; // Face descriptor for matching
  timestamp: string;
  age?: number;
  gender?: string;
  expression?: string;
  confidence: number;
  notes?: string;
}

export interface StoredVideo {
  id: string;
  videoData: string; // Base64 encoded video
  timestamp: string;
  duration: number;
  size: string;
  mimeType: string;
}

const DB_NAME = "FaceRecognitionDB";
const FACES_STORE = "faces";
const VIDEOS_STORE = "videos";
const DB_VERSION = 2;

class FaceDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(FACES_STORE)) {
          const objectStore = db.createObjectStore(FACES_STORE, { keyPath: "id" });
          objectStore.createIndex("timestamp", "timestamp", { unique: false });
        }
        if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
          const videoStore = db.createObjectStore(VIDEOS_STORE, { keyPath: "id" });
          videoStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  // ── Face methods ──

  async addFace(face: StoredFace): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FACES_STORE], "readwrite");
      const store = transaction.objectStore(FACES_STORE);
      const request = store.add(face);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFaces(): Promise<StoredFace[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FACES_STORE], "readonly");
      const store = transaction.objectStore(FACES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFace(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FACES_STORE], "readwrite");
      const store = transaction.objectStore(FACES_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAllFaces(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FACES_STORE], "readwrite");
      const store = transaction.objectStore(FACES_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFaceCount(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FACES_STORE], "readonly");
      const store = transaction.objectStore(FACES_STORE);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ── Video methods ──

  async addVideo(video: StoredVideo): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEOS_STORE], "readwrite");
      const store = transaction.objectStore(VIDEOS_STORE);
      const request = store.add(video);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllVideos(): Promise<StoredVideo[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEOS_STORE], "readonly");
      const store = transaction.objectStore(VIDEOS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteVideo(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEOS_STORE], "readwrite");
      const store = transaction.objectStore(VIDEOS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAllVideos(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEOS_STORE], "readwrite");
      const store = transaction.objectStore(VIDEOS_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getVideoCount(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([VIDEOS_STORE], "readonly");
      const store = transaction.objectStore(VIDEOS_STORE);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const faceDB = new FaceDatabase();
