import Snackbar from '../components/Snackbar';
import { byId } from '../models/DataProviders';

export default class ChartDataBuilder {
  constructor(rawData, provider) {
    this._metricName = null;
    this._provider = null;
    this._labels = [];
    this._data = []

    switch (provider) {
      case byId.owm:
        throw new Error("Not Implemented!")
        break;
      case byId.coinapi:
        throw new Error("Not Implemented!")
        break;
      case byId.openaq:
        this._metricName = rawData[0].metric;
        this._provider = provider;
        rawData.forEach(datum => this._labels.push(datum.date));
        rawData.forEach(datum => this._data.push(datum.value));
        break;

      default:
        Snackbar.showSnackbar({
          message: `${provider} isn't a valid provider`,
          actionText: 'Dismiss'
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
