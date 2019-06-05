import { THRESHOLD_ANNOTATION_ID } from "../Constants";

export default class ChartConfigurationBuilder {
  constructor(data, provider) {
    this.data = data;
    this.scales = {
      yAxes: [
        {
          ticks: {
            beginAtZero: false
          }
        }
      ]
    };

    this.annotation = {
      annotations: [
        {
          $$id$$: THRESHOLD_ANNOTATION_ID,
          drawTime: "afterDraw",
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          value: 0,
          borderColor: "#777",
          borderDash: [5, 2.5],
          borderWidth: 1.5,
          label: {
            content: "Threshold"
          }
        }
      ]
    };
  }

  getResult() {
    return {
      type: "line",
      data: this.data,
      options: {
        events: [],
        responsive: true,
        scales: this.scales,
        annotation: this.annotation
      }
    };
  }
}
