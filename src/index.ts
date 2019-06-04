import "material-design-lite/material";
import "mdl-select-component/src/selectfield/selectfield";
import "chart.js/dist/Chart";
import "chartjs-plugin-annotation";

import App from './components/App.js';
import { Snackbar } from "./components/Snackbar.js";

App.main().catch(error => {
  Snackbar.showSnackbar({
    message: error,
    timeout: 10000,
    actionText: 'Dismiss',
    actionHandler: (event) => console.error(error)
  });
});

/**
 * Note: This file type is Typesctipt as a workaround for Parcel.
 * The rest of the project uses only vanilla Javascript (ES6).
 */
