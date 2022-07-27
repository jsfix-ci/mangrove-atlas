import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import WidgetLegend from 'components/widget-legend';
import WidgetTooltip from 'components/widget-tooltip';

const numberFormat = format(',.3r');

const chunk = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunkedArr[chunkedArr.length - 1];
    if (!last || last.length === size) {
      chunkedArr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunkedArr;
};

const getData = (data, selectedYear) => {
  if (!data || !data.length) return null;
  const dataFormatted = data.find(({ date }) => date.includes(selectedYear)).hmax_hist_m;
  const barsData = dataFormatted.map(value => value[1]);
  const total = Object.values(barsData).reduce((previous, current) => current + previous);

  const chunksNumber = barsData.length / 5;
  const chunkedData = chunk(barsData, chunksNumber);
  const formattedData = chunkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  return [
    {
      year: selectedYear,
      '0–13 m': formattedData[0] / total * 100,
      '14–26 m': formattedData[1] / total * 100,
      '27–39 m': formattedData[2] / total * 100,
      '40–52 m': formattedData[3] / total * 100,
      '53–65 m': formattedData[4] / total * 100,
    }
  ];
};

const getHeightCoverage = (data, date) => {
  const yearData = data?.find(d => d.date.includes(date));
  if (!yearData) return null;
  return yearData.hmax_m.toFixed(2);
};

const getDownloadData = (chartData, heightCoverage, date) => {
  if (!chartData || !chartData.length) return null;
  const data = chartData[0];
  return [{
    Date: date,
    'Mangrove maximum canopy height (m)': heightCoverage,
    '0–13 m': `percentage(%): ${data['0–13 m']} - color: #C9BB42`,
    '13–26 m': `percentage(%): ${data['13–26 m']} - color: #8BA205`,
    '26–39 m': `percentage(%): ${data['26–39 m']} - color: #428710`,
    '39-52 m': `percentage(%): ${data['39–52 m']} - color: #0A6624`,
    '52–65 m': `percentage(%): ${data['52–65 m']} - color: #103C1F`,
  }];
};

export const CONFIG = {
  parse: (data, yearSelected, years) => {
    {
      const chartData = getData(data, yearSelected);
      const heightCoverage = getHeightCoverage(data, yearSelected);
      const downloadData = getDownloadData(chartData, heightCoverage, yearSelected);

      return {
        chartData,
        heightCoverage,
        downloadData,
        chartConfig: {
          height: 360,
          cartesianGrid: {
            vertical: false,
            horizontal: true,
            strokeDasharray: '5 20'
          },
          margin: { top: 20, right: 0, left: 0, bottom: 20 },
          xKey: 'year',
          yKeys: {
            bars:
            {
              '0–13 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#C9BB42',
                stroke: '#C9BB42',
                isAnimationActive: false
              },
              '14–26 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#8BA205',
                stroke: '#8BA205',
                isAnimationActive: false
              },
              '27–39 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#428710',
                stroke: '#428710',
                isAnimationActive: false
              },
              '40–52 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#0A6624',
                stroke: '#0A6624',
                isAnimationActive: false
              },
              '53–65 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#103C1F',
                stroke: '#103C1F',
                isAnimationActive: false
              }
            }
          },
          referenceLines: [{
            y: 0,
            stroke: 'black',
            strokeDasharray: 'solid',
            fill: 'black',
            opacity: '1',
            label: null
          }],
          xAxis: {
            tick: {
              fontSize: 12,
              lineheight: 20,
              fill: 'rgba(0, 0, 0, 0.54)'
            },
            ticks: years,
            interval: 0
          },
          yAxis: {
            tick: {
              fontSize: 12,
              fill: 'rgba(0,0,0,0.54)'
            },
            width: 40,
            tickFormatter: value => Math.round(value),
            domain: [0, 100],
            interval: 0,
            orientation: 'right',
            label: {
              value: '%',
              position: 'top',
              offset: 25
            },
            type: 'number'
          },
          legend: {
            align: 'left',
            verticalAlign: 'top',
            layout: 'horizontal',
            height: 80,
            top: 0,
            left: 0,
            position: 'relative',
            content: (properties) => {
              const { payload } = properties;
              const groups = groupBy(payload, p => p.payload.label);
              return <WidgetLegend type="height" groups={groups} />;
            }
          },
          tooltip: {
            cursor: false,
            content: (properties) => {
              const { payload } = properties;
              return (
                <WidgetTooltip
                  payload={payload}
                  type="column"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexDirection: 'column'
                  }}
                  settings={payload.map(p => (
                    { label: p.name, key: p.value, color: p.color, format: value => `${numberFormat(p.value)}%` || '0%', position: '_column', type: '_stacked'}
                  ))}
                />
              );
            }
          }
        },
      };
    }
  }
};


export default CONFIG;