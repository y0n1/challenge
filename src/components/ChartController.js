import {
  THRESHOLD_ANNOTATION_ID,
  BELOW_THRESHOLD_COLOR,
  OVER_THRESHOLD_COLOR
} from "../Constants";
import {
  thresholdControl,
  dataPointsControl,
} from "./Options";
import DataProviderProxy from "../services/DataProviderProxy";


/**
 * This componet should have been called 'Chart',
 * however ChartJS hijacked that name violently.
 */
export default class ChartController {
  constructor(configuration = {}, providerId) {
    this._providerId = providerId;
    this._chart = null;
    this._configuration = configuration;
    this._defaultDataPoints = {
      values: [],
      colors: []
    };

    /**
     * Save the original data we got after the initial request,
     * in order to allow displaying slices of the original data.
     */
    const dataSetConfig = this.getDataSetConfigSection(this._providerId);
    dataSetConfig.data.forEach((dataPointValue, idx) => {
      const dataPointColor = dataSetConfig.backgroundColor[idx];
      this._defaultDataPoints.values.push(dataPointValue);
      this._defaultDataPoints.colors.push(dataPointColor);
    });

    const min = Math.min(...dataSetConfig.data);
    const max = Math.max(...dataSetConfig.data);
    const avg = (min + max) / 2;

    this.updateThresholdValue(THRESHOLD_ANNOTATION_ID, avg);
    this.updateDataPointsColors(this._providerId, avg);

    // reflect the amount of datapoins in the control props
    const maxDataPoints = this._defaultDataPoints.values.length;
    dataPointsControl.setAttribute("max", maxDataPoints);
    dataPointsControl.setAttribute("value", maxDataPoints);

    // reflect avg, min and max proprs on threshold control
    thresholdControl.setAttribute("min", min);
    thresholdControl.setAttribute("max", max);
    thresholdControl.setAttribute("value", avg);

    const thresholdChangeListener = this.handleThresholdChange.bind(this);
    thresholdControl.$listeners.push({
      eventName: "change",
      eventListener: thresholdChangeListener
    });
    thresholdControl.addEventListener("change", thresholdChangeListener);

    const dataPointsChangeListener = this.handleDataPointsChange.bind(this);
    dataPointsControl.$listeners.push({
      eventName: "change",
      eventListener: dataPointsChangeListener
    });
    dataPointsControl.addEventListener("change", dataPointsChangeListener);

    let canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.remove();
    } else {
      canvas = document.createElement("canvas");
    }

    const pageContent = document.querySelector(".page-content");
    pageContent.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    this._chart = new Chart(ctx, configuration);
  }

  handleDataPointsChange(event) {
    const newValue = +event.target.value;
    const currentThreshold = this.getThresholdConfigSection(
      THRESHOLD_ANNOTATION_ID
    ).value;
    this.updateDataPointsAmount(this._providerId, newValue);
    this.updateDataPointsColors(this._providerId, currentThreshold);
    this._chart.update();
  }

  handleThresholdChange(event) {
    const newValue = +event.target.value;
    const currentThreshold = this.getThresholdConfigSection(
      THRESHOLD_ANNOTATION_ID
    ).value;
    if (newValue !== currentThreshold) {
      this.updateThresholdValue(THRESHOLD_ANNOTATION_ID, newValue);
      this.updateDataPointsColors(this._providerId, newValue);
      this._chart.update();
    }
  }

  updateDataPointsAmount(providerId, newValue) {
    const targetDataSet = this.getDataSetConfigSection(this._providerId);
    targetDataSet.data = this._defaultDataPoints.values.slice(0, newValue);
    targetDataSet.backgroundColor = this._defaultDataPoints.colors.slice(
      0,
      newValue
    );
  }

  getThresholdConfigSection(thresholdAnnotationId) {
    const rootObj = this._chart == null ? this._configuration : this._chart;
    const [thresholdConfig] = rootObj.options.annotation.annotations.filter(
      annotation => annotation.$$id$$ === thresholdAnnotationId
    );

    return thresholdConfig;
  }

  updateThresholdValue(thresholdAnnotationId, newValue) {
    const thresholdConfig = this.getThresholdConfigSection(
      thresholdAnnotationId
    );
    thresholdConfig.value = newValue;
  }

  getDataSetConfigSection(datasetId) {
    const rootObj = this._chart == null ? this._configuration : this._chart;
    const [targetDataSet] = rootObj.data.datasets.filter(
      dataset => dataset.$$id$$ === datasetId
    );

    return targetDataSet;
  }

  updateDataPointsColors(datasetId, thresholdValue) {
    const targetDataSet = this.getDataSetConfigSection(datasetId);

    if (targetDataSet.data.length > 0) {
      targetDataSet.backgroundColor = targetDataSet.data.map(datum =>
        datum >= thresholdValue ? OVER_THRESHOLD_COLOR : BELOW_THRESHOLD_COLOR
      );
    }
  }
}
