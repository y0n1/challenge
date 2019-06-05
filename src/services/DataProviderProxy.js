import LoadingOverlay from "../components/LoadingOverlay";
import { Snackbar } from "../components/Snackbar";
import moment from "moment";
import { byId } from "../models/DataProviders";
import { FETCH_ABORT_TIMEOUT } from "../Constants";

const urlBuilder = providerId => {
  let url = null;
  switch (providerId) {
    case byId.meetup:
      url =
        "https://api.meetup.com/2/cities?sign=true&photo-host=public&page=200&country=us";
      break;
    case byId.openaq:
      const twoMonthsFromNow = moment()
        .subtract(2, "months")
        .toISOString();
      url = `https://api.openaq.org/v1/measurements?country=HK&order_by=parameter&date_from=${twoMonthsFromNow}&location=Central`;
      break;
    case byId.coinapi:
      url =
        "https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=26409A92-0B27-4DAB-ACAE-5D06DD82439B";
      break;
    default:
      Snackbar.showSnackbar({
        message: `${provider} isn't a valid provider`,
        actionText: "Dismiss",
        actionHandler: event => {
          Snackbar.cleanup_();
        }
      });
      break;
  }

  return url;
};

const responseBuilder = (responseData, providerId) => {
  let actualResponse = null;
  switch (providerId) {
    case byId.openaq: {
      const { results } = responseData;
      actualResponse = results.map(result => ({
        value: result.value,
        unit: result.unit,
        metric: result.parameter,
        date: result.date.local
      }));
      break;
    }
    case byId.meetup: {
      const { results } = responseData;
      actualResponse = results.map(result => ({
        id: result.id,
        memberCount: result["member_count"]
      }));
      break;
    }
    case byId.coinapi: {
      const { time, rate } = responseData;
      actualResponse = [{ rate, time }];
      break;
    }
    default:
      Snackbar.showSnackbar({
        message: `${provider} isn't a valid provider`,
        actionText: "Dismiss",
        actionHandler: event => {
          Snackbar.cleanup_();
        }
      });
      break;
  }

  return actualResponse;
};

export default class DataProviderProxy {
  constructor(providerId, abortController = null) {
    this._providerId = providerId;
    this._abortController = abortController;
  }

  async getdata() {
    let parsedData = null;
    const { signal } = this._abortController;
    let timeout = null;

    LoadingOverlay.show();
    try {
      timeout = setTimeout(() => this._abortController.abort(), FETCH_ABORT_TIMEOUT);
      const response = await fetch(urlBuilder(this._providerId), { signal });
      const data = await response.json();
      parsedData = responseBuilder(data, this._providerId);
    } catch (error) {
      Snackbar.showSnackbar({
        message: `${
          error.name === "AbortError"
            ? "The provider did not respond in the alotted time"
            : error.message
        } `
      });
    } finally {
      clearTimeout(timeout);
      LoadingOverlay.hide();
    }

    return parsedData;
  }
}
