// Import required modules and data types.
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private options: string[] = []; // Array to hold the list of options.
  private optionsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]); // BehaviorSubject to emit the updated options to subscribers.

  constructor() {
    this.loadOptionsFromLocalStorage();
  }

  // Method to get the list of options.
  getOptions(): string[] {
    return this.options;
  }

  // Method to add a new option to the list.
  addOption(newOption: string) {
    this.options.push(newOption); // Add the new option to the options array.
    this.saveOptionsToLocalStorage(); // Save the updated options to local storage.
    this.optionsSubject.next(this.options); // Emit the updated options to subscribers.
  }

  // Method to get the BehaviorSubject for options.
  getOptionsSubject(): BehaviorSubject<string[]> {
    return this.optionsSubject;
  }

  // Method to update the options array with new values.
  updateOptions(options: string[]) {
    this.options = options; // Update the options array with the new values.
    this.saveOptionsToLocalStorage(); // Save the updated options to local storage.
    this.optionsSubject.next(this.options); // Emit the updated options to subscribers.
  }

  // Private method to load options from local storage during service initialization.
  private loadOptionsFromLocalStorage() {
    const storedOptions = localStorage.getItem('options');
    if (storedOptions) {
      this.options = JSON.parse(storedOptions); // Parse the stored options from local storage.
      this.optionsSubject.next(this.options); // Emit the initial options to subscribers.
    }
  }

  // Private method to save options to local storage.
  private saveOptionsToLocalStorage() {
    localStorage.setItem('options', JSON.stringify(this.options)); // Save the options array to local storage as a string.
  }

  // Method to get an Observable for options to subscribe to changes.
  getOptionsObservable(): Observable<string[]> {
    return this.optionsSubject.asObservable();
  }
}
