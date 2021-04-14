import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private currentContext: string;

  // Initializes the default context and runs preflight check.
  constructor() {
    this.currentContext = "default";
    if (this.preflight() === -1) {
      console.error("Could not initialize datastore.");
    }
  }

  // Checks to ensure local storage can be accessed.
  private preflight(): number {
    this.store("proc", "nge");
    const value = this.fetch("proc");
    this.delete("proc");
    return value === "nge" ? 1 : -1;
  }

  // Sets the "context", a string prefix for all values.
  // We use contexts to help avoid key collisions.
  setContext(context: string): void {
    this.currentContext = context;
  }

  // Retrieves the current context.
  getContext(): string {
    return this.currentContext;
  }

  // Stores a string: { context_key, value }
  store(key: string, value: string): void {
    localStorage.setItem(`${this.getContext()}__${key}`, value);
  }

  // Fetches a key from the current context.
  // Returns "ERR" if not found.
  fetch(key: string): string {
    const value = localStorage.getItem(`${this.getContext()}__${key}`);
    if (value) {
      return value;
    } else {
      console.warn(`Key "${key}" does not exist in datastore.`);
      return "ERR";
    }
  }

  // If key exists, deletes and creates a new one.
  // If it doesn't exist, warn and create anyway.
  update(key: string, value: string): void {
    if (this.fetch(key) === "ERR") {
      console.warn("Update called on item that does not exist!");
    }

    this.store(key, value);
  }

  // Deletes a key from the current context.
  delete(key: string): void {
    localStorage.removeItem(`${this.getContext()}__${key}`);
  }

  // Clears the *entire* localStorage database.
  nuke(): void {
    localStorage.clear();
  }
}
