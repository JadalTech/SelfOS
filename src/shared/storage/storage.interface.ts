/**
 * Storage Service Interface
 *
 * Abstract contract for key-value storage.
 * Business code depends ONLY on this interface, never on a concrete
 * implementation (AsyncStorage, MMKV, SecureStore, etc.).
 *
 * This allows swapping storage backends without touching consumers.
 */

/**
 * Platform-agnostic key-value storage interface.
 *
 * All methods are async to accommodate implementations that require
 * asynchronous I/O (e.g., AsyncStorage, SecureStore).
 *
 * Implementations that are synchronous (e.g., MMKV) can simply
 * return resolved promises.
 */
export interface StorageService {
  /**
   * Retrieve a string value by key.
   * Returns `null` if the key does not exist.
   */
  get(key: string): Promise<string | null>;

  /**
   * Store a string value under the given key.
   */
  set(key: string, value: string): Promise<void>;

  /**
   * Remove a single key from storage.
   */
  remove(key: string): Promise<void>;

  /**
   * Remove ALL keys from storage.
   * Use with caution — this wipes all persisted data.
   */
  clear(): Promise<void>;

  /**
   * Check whether a key exists in storage.
   */
  contains(key: string): Promise<boolean>;

  /**
   * Retrieve and parse a JSON-serialized object.
   * Returns `null` if the key does not exist or parsing fails.
   */
  getObject<T>(key: string): Promise<T | null>;

  /**
   * Serialize an object to JSON and store it under the given key.
   */
  setObject<T>(key: string, value: T): Promise<void>;
}
