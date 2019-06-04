import {
  THRESHOLD_ANNOTATION_ID,
  BELOW_THRESHOLD_COLOR,
  OVER_THRESHOLD_COLOR,
} from "../Constants";
import { thresholdControl, dataPointsControl } from "./Options";
import { Snackbar } from "./Snackbar";

let chart = null;
const defaultDataPoints = {
  values: [],
  colors: [],
};

/**
 * This componet should have been called "Chart",
 * however ChartJS hijacked that name violently.
 */
export default class ChartController {
  constructor(configuration = {}, providerId) {
    this.configuration = configuration;
    const currentThreshold = this.getThresholdConfiguration(
      THRESHOLD_ANNOTATION_ID,
    ).value;
    this.updateDataPointsColors(providerId, currentThreshold);

    const canvas = document.querySelector("#chart");
    const ctx = canvas.getContext("2d");
    chart = new Chart(ctx, configuration);

    /**
     * Save the original data we got after the initial request,
     * in order to allow displaying slices of the original data.
     */
    const dataSetConfig = this.getDataSetConfiguration(providerId);
    dataSetConfig.data.forEach((dataPointValue, idx) => {
      const dataPointColor = dataSetConfig.backgroundColor[idx];
      defaultDataPoints.values.push(dataPointValue);
      defaultDataPoints.colors.push(dataPointColor);
    })

    // reflect the amount of datapoins in the control
    const maxDataPoints = defaultDataPoints.values.length;
    dataPointsControl.setAttribute('max', maxDataPoints);

    // do the same for the threshold control, this time we need
    //the max value
    const max = Math.max(dataSetConfig.data);
    thresholdControl.setAttribute('max', max);


    thresholdControl.addEventListener("change", event => {
      const newValue = +event.target.value;
      if (newValue !== currentThreshold) {
        this.updateThresholdValue(THRESHOLD_ANNOTATION_ID, newValue);
        this.updateDataPointsColors(providerId, newValue);
        chart.update();
      }
    });

    dataPointsControl.addEventListener('change', (event) => {
      const newValue = +event.target.value;
      this.updateDataPointsAmount(providerId, newValue);
      chart.update();
    });
  }

  updateDataPointsAmount(providerId, newValue) {
    if (newValue < 0 || newValue > defaultDataPoints.values.length) {
      Snackbar.showSnackbar({
        message: 'Datapoints amount out of bounds!',
        actiontext: 'Dismiss',
      });

      return;
    }

    const targetDataSet = this.getDataSetConfiguration(providerId);

  }

  getThresholdConfiguration(thresholdAnnotationId) {
    const rootObj = chart == null ? this.configuration: chart;
    const [thresholdConfig] = rootObj.options.annotation.annotations.filter(
      annotation => annotation.$$id$$ === thresholdAnnotationId
    );

    return thresholdConfig;
  }

  updateThresholdValue(thresholdAnnotationId, newValue) {
    const thresholdConfig = this.getThresholdConfiguration(thresholdAnnotationId);
    thresholdConfig.value = newValue;
  }

  getDataSetConfiguration(datasetId) {
    const rootObj = chart == null ? this.configuration: chart;
    const [targetDataSet] = rootObj.data.datasets.filter(
      dataset => dataset.$$id$$ === datasetId
    );

    return targetDataSet;
  }

  setDataPointsColors(data, threshold, belowColor, overColor) {
    return data.map(datum => (datum >= threshold ? overColor : belowColor));
  }

  updateDataPointsColors(datasetId, thresholdValue) {
    const targetDataSet = this.getDataSetConfiguration(datasetId);

    if (targetDataSet.data.length > 0) {
      targetDataSet.backgroundColor = this.setDataPointsColors(
        targetDataSet.data,
        thresholdValue,
        BELOW_THRESHOLD_COLOR,
        OVER_THRESHOLD_COLOR
      );
    }
  }
}
