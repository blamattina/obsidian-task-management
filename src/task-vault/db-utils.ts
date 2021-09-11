export interface Dao<T> {
  constructor(db: IDBDatabase): void;
  getAll(): Promise<T[]>;
  create(item: T): Promise<string>;
  read(key: any): Promise<T>;
  update(item: T): Promise<T>;
  delete(item: T): Promise<T>;
}

export async function transact(
  transaction: IDBTransaction,
  operation: Function
): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = reject;
  });

  const result = await operation(transaction);

  return promise.then(() => result);
}

export async function request<T>(request: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = reject;
  });
}
export async function initializeDb(
  name: string,
  version: number,
  upgradeFn: Function
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = upgradeFn;

    request.onsuccess = () => {
      const db = request.result;

      resolve(db);
    };

    request.onerror = reject;
  });
}

export async function find<T>(request: any, predicate: Function): Promise<T[]> {
  const results: T[] = [];
  return new Promise((resolve) => {
    request.onsuccess = (event: any) => {
      const cursor = event.target.result;

      if (cursor) {
        if (predicate(cursor.value)) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
  });
}
