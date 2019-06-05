import {
  providerSelector,
  thresholdControl,
  pollingControl,
  dataPointsControl,
  removeListeners
} from "./Options";
import DataProviderProxy from "../services/DataProviderProxy";
import ChartController from "./ChartController";
import ChartDataBuilder from "../services/ChartDataBuilder";
import ChartConfigurationBuilder from "../services/ChartConfigurationBuilder";

export default class App {
  static async main() {
    const { selectedOptions, selectedIndex } = providerSelector;
    const providerId = selectedOptions[selectedIndex].value;

    App.switchTo(providerId);

    providerSelector.addEventListener("change", event => {
      const providerId = event.target.value;

      /**
       * Once the ChartController is instantiated it registers listeners for
       * the controls below. We need to clear those listener before switching
       * to other provider because each time we do that we create a new
       * instance of ChartContoller.
       */
      removeListeners([
        thresholdControl,
        pollingControl,
        dataPointsControl
      ]);
      App.switchTo(providerId);
    });
  }

  static async switchTo(providerId) {
    const dataProviderProxy = new DataProviderProxy(providerId, new AbortController());
    const rawData = await dataProviderProxy.getdata();
    const dataBuilder = new ChartDataBuilder(rawData, providerId);
    const data = dataBuilder.getResult();
    const configurationBuilder = new ChartConfigurationBuilder(
      data,
      providerId
    );
    const configuration = configurationBuilder.getResult();
    const chartController = new ChartController(configuration, providerId);
  }
}
