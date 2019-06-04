const snackbarEl = document.querySelector("#snackbar");
componentHandler.upgradeElement(snackbarEl);

const { MaterialSnackbar } = snackbarEl;

export {
  MaterialSnackbar as Snackbar
};
