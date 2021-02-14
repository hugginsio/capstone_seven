import { Injectable } from '@angular/core';
import { validateLocaleAndSetLanguage } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private currentContext: string;

  constructor() {
    this.currentContext = 'default';
    if (this.preflight() === -1) {
      console.error('Could not initialize datastore.');
    }
  }

  preflight(): number {
    this.store('proc', 'nge');
    const value = this.fetch('proc');
    this.delete('proc');
    return value === 'nge' ? 1 : -1;
  }

  setContext(context: string): void {
    this.currentContext  = context;
  }

  getContext(): string {
    return this.currentContext;
  }

  store(key: string, value: string): void {
    localStorage.setItem(`${this.getContext()}_${key}`, value);
  }

  fetch(key: string): string {
    const value = localStorage.getItem(`${this.getContext()}_${key}`);
    if (value) {
      return value;
    } else {
      console.warn(`Key "${key}" does not exist in datastore.`);
      return 'ERR';
    }
  }

  update(key: string, value: string): void {
    console.log(this.fetch(key));
    if (this.fetch(key) === 'ERR') {
      console.warn('Update called on item that does not exist!');
    }

    this.store(key, value);
  }

  delete(key:string): void {
    localStorage.removeItem(`${this.getContext()}_${key}`);
  }

  nuke(): void {
    localStorage.clear();
  }
}
