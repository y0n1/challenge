import LoadingOverlay from "../components/LoadingOverlay";
import {Snackbar} from "../components/Snackbar";
import moment from 'moment';

const urlBuilder = ({ since }) => {
  return `https://api.openaq.org/v1/measurements?country=HK&order_by=parameter&date_from=${since}&location=Central`;
}

export default class DataProviderProxy {
  async getdata() {
    LoadingOverlay.show();

    try {
      const twoMonthsFromNow = moment()
        .subtract(2, "months")
        .toISOString();
      const response = await fetch(urlBuilder({ since: twoMonthsFromNow }));
      const data = await response.json();
      const parsedData = data.results.map(result => {
        return {
          value: result.value,
          unit: result.unit,
          metric: result.parameter,
          date: result.date.local,
        };
      });
      Snackbar.cleanup_()

      return parsedData;
    } catch (error) {
      Snackbar.showSnackbar({
        message: error.message
      });
    } finally {
      LoadingOverlay.hide();
    }
  }
}
