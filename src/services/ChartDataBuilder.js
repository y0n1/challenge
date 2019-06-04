import Snackbar from '../components/Snackbar';

let _provider = null;
const _labels = [];
const _data = []
let _metricName = null;

export default class ChartDataBuilder {
  constructor(rawData, provider) {
    switch (provider) {
      case 'owm':
        break;
      case 'coinapi':
        break;
      case 'openaq':
        _provider = provider;
        rawData.forEach(datum => _labels.push(datum.date));
        rawData.map(datum => _data.push(datum.value));
        _metricName = rawData[0].metric;
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
      labels: _labels,
      datasets: [
        {
          $$id$$: _provider,
          label: _metricName,
          data: _data,
          fill: false,
          backgroundColor: [],
          borderWidth: 2
        }
      ]
    };
  }
}
