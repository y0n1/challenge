const thresholdControl = document.querySelector("#threshold-control");
thresholdControl.$listeners = thresholdControl.$listeners || [];

const dataPointsControl = document.querySelector("#data-points-control");
dataPointsControl.$listeners = dataPointsControl.$listeners || [];

const providerSelector = document.querySelector("#provider-selector");
providerSelector.$listeners = providerSelector.$listeners || [];

const removeListeners = (controls) => {
  controls.forEach(control =>
    control.$listeners.forEach(({ eventName, eventListener }) =>
      control.removeEventListener(eventName, eventListener)
    )
  );
};

export {
  thresholdControl,
  dataPointsControl,
  providerSelector,
  removeListeners,
};
