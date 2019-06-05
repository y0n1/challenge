import Snackbar from "../components/Snackbar";
import { byId } from "../models/DataProviders";

export default class ChartDataBuilder {
  constructor(rawData, provider) {
    this._provider = provider;
    this._metricName = null;
    this._labels = [];
    this._data = [];

    switch (provider) {
      case byId.meetup:
        this._metricName = "Members per meetup ID in USA";
        rawData.forEach(datum => this._labels.push(datum.id));
        rawData.forEach(datum => this._data.push(datum.memberCount));
        break;
      case byId.openaq:
        this._metricName = "Carbon Monoxide (CO)";
        rawData.forEach(datum => this._labels.push(datum.date));
        rawData.forEach(datum => this._data.push(datum.value));
        break;
      case byId.coinapi:
        this._metricName = "BTC/USD Exchange Rate";
        rawData.forEach(datum => this._labels.push(datum.time));
        rawData.forEach(datum => this._data.push(datum.rate));
        break;

      default:
        Snackbar.showSnackbar({
          message: `${provider} isn't a valid provider`,
          actionText: "Dismiss",
          actionHandler: (event) => {
            Snackbar.cleanup_();
          }
        });
        break;
    }
  }

  getResult() {
    return {
      labels: this._labels,
      datasets: [
        {
          $$id$$: this._provider,
          label: this._metricName,
          data: this._data,
          fill: false,
          backgroundColor: [],
          borderWidth: 2
        }
      ]
    };
  }
}
