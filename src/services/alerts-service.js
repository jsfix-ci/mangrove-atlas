import axios from "axios";

class AlertsService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://us-central1-mangrove-atlas-246414.cloudfunctions.net",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  fetchAlerts = (params = {}) =>
    this.client
      .get("/fetch-alerts", {
        params: {
          ...params,
        },
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });

  fetchMangroveCustomAreaAnalysisData = ({ geojson, data }) => {
    const controller = new AbortController();
    return this.client
      .request({
        method: "post",
        url: "/fetch-alerts",
        data: !!data ? data : {
          geometry: {
            type: "FeatureCollection",
            features: geojson,
          },
        },
        signal: controller.signal,
      })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  };
}

export default new AlertsService();
