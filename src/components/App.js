import {
  providerSelector,
  thresholdControl,
  dataPointsControl
} from "./Options";
import DataProviderProxy from "../services/DataProviderProxy";
import ChartController from './ChartController';
import ChartDataBuilder from '../services/ChartDataBuilder';
import ChartConfigurationBuilder from '../services/ChartConfigurationBuilder';

export default class App {
  static async main() {
    const { selectedOptions, selectedIndex } = providerSelector;
    const providerId = selectedOptions[selectedIndex].value;

    App.switchTo(providerId);

    providerSelector.addEventListener('change', (event) => {
      const providerId = event.target.value;
      App.switchTo(providerId);
    });
  }

  static async switchTo(providerId) {
    const dataProviderProxy = new DataProviderProxy(providerId);
    const rawData = await dataProviderProxy.getdata();
    console.log(rawData);

    const dataBuilder = new ChartDataBuilder(rawData, providerId);
    const data = dataBuilder.getResult();
    const configurationBuilder = new ChartConfigurationBuilder(data, providerId);
    const configuration = configurationBuilder.getResult();
    const chartController = new ChartController(configuration, providerId);
  }
}
