import { openDB } from "idb";

export class Idb {
  constructor() {
    this.dbPromise = openDB("keyval-store", 1, {
      upgrade(db) {
        db.createObjectStore("keyval");
      },
    });
  }

  dbPromise = openDB("keyval-store", 1, {
    upgrade(db) {
      db.createObjectStore("keyval");
    },
  });

  getVal = async (key: string) => {
    return (await this.dbPromise).get("keyval", key);
  };

  setVal = async (key: string, val: string) => {
    return (await this.dbPromise).put("keyval", val, key);
  };

  delVal = async (key: string) => {
    return (await this.dbPromise).delete("keyval", key);
  };

  clearStore = async () => {
    return (await this.dbPromise).clear("keyval");
  };

  getAllkeys = async () => {
    return (await this.dbPromise).getAllKeys("keyval");
  };
}
