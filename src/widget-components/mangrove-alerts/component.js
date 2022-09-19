import React, { useState, useEffect } from "react";
import Select from "components/select";
import ChartWidget from "components/chart-widget";

import config from "./config";

const MangroveAlerts = ({
  data,
  isLoading,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui = {},
  currentLocation,
  setUi,
  fetchAlerts,
  ...props
}) => {
  const { year, startDate, endDate } = ui;

  const [initialDate, setInitialDate] = useState({
    startInitialDate: null,
    endInitialDate: null,
  });

  useEffect(() => {
    fetchAlerts({
      ...(initialDate.startInitialDate && { start_date: startDate?.value }),
      ...(initialDate.endInitialDate && { end_date: endDate?.value }),
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.location_id,
      }),
    });
    if (startDate?.value || endDate?.value) {
      setInitialDate({
        startInitialDate: null,
        endInitialDate: null,
      })
    }
  }, [
    currentLocation.location_id,
    currentLocation.iso,
    fetchAlerts,
    startDate,
    endDate,
  ]);

  const {
    chartData,
    chartConfig,
    total,
    downloadData,
    startDateOptions,
    endDateOptions,
  } = config.parse(data, startDate, endDate, year);

  useEffect(() => {
    setInitialDate({
      startInitialDate: startDateOptions[0],
      endInitialDate: endDateOptions[endDateOptions.length - 1],
      });
  }, [
    startDateOptions.length,
    endDateOptions.length,
  ]);

  useEffect(() => {
    if(startDateOptions[0] !== startDate?.value || endDateOptions[endDateOptions.length - 1] !== endDate?.value) {
      setUi({
        id: "alerts",
        value: {
          startDate: startDateOptions[0],
          endDate: endDateOptions[endDateOptions.length - 1],
        },
      });
    }
  }, [
    startDateOptions.length,
    endDateOptions.length,
    currentLocation.location_id,
    currentLocation.iso,
  ]);

  if (chartData.length <= 0) {
    return null;
  }

  const changeDate = (type, value) => {
    const yyyy = new Date(value).getFullYear();
    const mm = new Date(value).getMonth();

    const monthsConversionAlt = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };

    const monthLabel = monthsConversionAlt[mm];
    const label = `${monthLabel}, ${yyyy}`;

    setUi({
      id: "alerts",
      value: {
        [type]: {
          label,
          value,
        },
      },
    });
  };

  const startDateSelect = (
    <Select
      value={startDate?.value}
      defaultValue={startDateOptions[0]}
      options={startDateOptions}
      isOptionDisabled={(option) =>
        option.value > endDate?.value || option.value === startDate?.value
      }
      onChange={(value) => changeDate("startDate", value)}
      classNamePrefix="react-select"
      className="alerts"
    />
  );

  const endDateSelect = (
    <Select
      value={endDate?.value}
      defaultValue={endDateOptions[endDateOptions.length - 1]}
      options={endDateOptions}
      isOptionDisabled={(option) =>
        option.value < startDate?.value || option.value === endDate?.value
      }
      onChange={(value) => changeDate("endDate", value)}
      classNamePrefix="react-select"
      className="alerts"
    />
  );
  const sentence = (
    <>
      There were <strong>{total}</strong> mangrove disturbance alerts
      <br />
      between {startDateSelect}
      &nbsp;and {endDateSelect}.
    </>
  );

  const chartRData = {
    data: chartData,
    config: chartConfig,
  };

  return (
    <ChartWidget
      name={name}
      downloadData={downloadData}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={isCollapsed}
      sentence={sentence}
      chartData={chartRData}
      {...props}
      onBrushEnd={({ startIndex, endIndex }) => {
        changeDate("startDate", chartData[startIndex].start);
        changeDate("endDate", chartData[endIndex].end);
      }}
    />
  );
};

export default MangroveAlerts;
