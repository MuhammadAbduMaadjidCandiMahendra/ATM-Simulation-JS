import {PAGE_STATE_STORAGE_KEY} from "./constant.js";

export const PageState = (name, callback) => ({
  name,
  callback,
});

export class PageStateContext {
  #availablePages = [];

  constructor(...pageState) {
    this.#availablePages.push(...pageState);
    if (!this.getCurrentState()) {
      this.saveCurrentState(this.#availablePages[0].name);
    }
  }

  static from = (...pageState) => {
    return new PageStateContext(...pageState);
  }

  applyCurrentState = () => {
    const state = this.getCurrentState();
    const pageState = this.findPageState(state);
    pageState.callback();
    return pageState.name;
  }

  findPageState = (name) => {
    return this.#availablePages.find((pageState) => pageState.name === name);
  }

  saveCurrentState = (name) => {
    localStorage.setItem(PAGE_STATE_STORAGE_KEY, name)
  }

  getCurrentState = () => {
    return localStorage.getItem(PAGE_STATE_STORAGE_KEY);
  }

}

