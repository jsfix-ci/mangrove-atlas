import React from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
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


const getData = (barValues) => {
  if (!barValues) return null;
  const barsData = barValues.map(value => value[1]);
  const chnkedData = chunk(barsData, 5);
  let formattedData = chnkedData.map(
    r => (r.reduce((previous, current) => current + previous))
  );

  const total = barsData.reduce((previous, current) => current + previous);
  formattedData = formattedData.map(data => data / total);
  return formattedData;
};


const histogramData = (data) => {
  if (!data) {
    return null;
  }
  const histogram = data.map(d => (
    {
      year: moment(d.date).year(),
      '0–5 m': getData(d.hmax_hist_m)[0] * 100,
      '5–10 m': getData(d.hmax_hist_m)[1] * 100,
      '10–15 m': getData(d.hmax_hist_m)[2] * 100,
      '15–20 m': getData(d.hmax_hist_m)[3] * 100,
      '20–25 m': getData(d.hmax_hist_m)[4] * 100,
    }
  ));
  return histogram;
};

const filterData = data => sortBy((data.filter(d => d.hmax_m !== null && d.hmax_hist_m !== null)), ['date']);
const getHeightCoverage = (data, date) => {
  const yearData = data.find(d => d.date.includes(date));
  if (!yearData) return null;
  return yearData.hmax_m.toFixed(2);
};

const metaData = data => Array.from(new Set(
  data.map(d => moment(d.date).year())
));

const getDownloadData = (chartData, heightCoverage, date) => {
  if (!chartData || !chartData.length) return null;
  const data = chartData[0];
  return [{
    Date: date,
    'Mangrove maximum canopy height (m)': heightCoverage,
    '0–5 m': `percentage(%): ${data['0–5 m']} - color: #C9BB42`,
    '5–10 m': `percentage(%): ${data['5–10 m']} - color: #8BA205`,
    '10–15 m': `percentage(%): ${data['10–15 m']} - color: #428710`,
    '15–20 m': `percentage(%): ${data['15–20 m']} - color: #0A6624`,
    '20–25 m': `percentage(%): ${data['20–25 m']} - color: #103C1F`,
  }];
};

export const CONFIG = {
  parse: (data, date) => {
    {
      const dataFiltered = filterData(data);
      const chartData = histogramData(dataFiltered);
      const heightCoverage = getHeightCoverage(dataFiltered, date);
      const downloadData = getDownloadData(chartData, heightCoverage, date);

      return {
        chartData,
        heightCoverage,
        downloadData,
        metadata: metaData(dataFiltered),
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
              '0–5 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#C9BB42',
                stroke: '#C9BB42',
                isAnimationActive: false
              },
              '5–10 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#8BA205',
                stroke: '#8BA205',
                isAnimationActive: false
              },
              '10–15 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#428710',
                stroke: '#428710',
                isAnimationActive: false
              },
              '15–20 m':
              {
                stackId: 'bar',
                barSize: 60,
                fill: '#0A6624',
                stroke: '#0A6624',
                isAnimationActive: false
              },
              '20–25 m':
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
            ticks: metaData(data),
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
            content: (
              <WidgetTooltip
                type="column"
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
                settings={[
                  { label: '0–5 m', color: '#C9BB42', key: '0–5 m', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '5–10 m', color: '#8BA205', key: '5–10 m', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '10–15 m', color: '#428710', key: '10–15 m', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '15–20 m', color: '#0A6624', key: '15–20 m', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                  { label: '20–25 m', color: '#103C1F', key: '20–25 m', format: value => `${numberFormat(value)} %`, position: '_column', type: '_stacked' },
                ].reverse()}
                label={{ key: 'name' }}
              />
            )
          }
        },
      };
    }
  }
};


export default CONFIG;
