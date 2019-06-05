import { Snackbar } from "./Snackbar";

const state = {
  isActive: false
};
const refs = {
  overlayRef: null,
  spinnerRef: null
};

class LoadingOverlayImpl {
  constructor() {
    refs.overlayRef = document.querySelector("#loading-overlay");
    refs.spinnerRef = document.querySelector("#spinner");
    componentHandler.upgradeElement(refs.spinnerRef);
  }

  get isActive() {
    return state.isActive;
  }

  show() {
    const { overlayRef, spinnerRef } = refs;
    Snackbar.showSnackbar({
      message: "Loading...",
      actionText: "Dismiss",
      timeout: 3000,
      actionHandler: event => {
        Snackbar.cleanup_();
      }
    });
    overlayRef.classList.add("is-visible");
    spinnerRef.classList.add("is-active");
    state.isActive = true;
  }

  hide() {
    const { overlayRef, spinnerRef } = refs;
    overlayRef.classList.remove("is-visible");
    spinnerRef.classList.remove("is-active");
    state.isActive = false;
  }
}

const LoadingOverlay = new LoadingOverlayImpl();
export default LoadingOverlay;
