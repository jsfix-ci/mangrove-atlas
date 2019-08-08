import { all, takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';
import DatasetService from 'services/dataset-service';
import { fetchRequested, fetchSucceeded, fetchFailed, toggleActive, toggleActiveByLayerId } from './actions';

const service = new DatasetService({ entityName: 'widgets' });

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export function* toggleWidgetActive({ payload }) {
  yield put(toggleActiveByLayerId({ layerId: payload.id, isActive: payload.isActive }));
}

export function* getWidgets() {
  yield put(fetchRequested());
  try {
    const widgets = yield call(service.fetch, []);

    // adding temporal widget for demo
    widgets.unshift({
      id: 'highlighted-areas',
      slug: 'highlighted-areas',
      name: 'Highlighted Areas',
      contextualLayerIds: [],
      layerId: null
    });

    yield put(fetchSucceeded(widgets));
  } catch (err) {
    yield put(fetchFailed(err));
  }
}

// Part of query state, not normal flow.
// View ./index.js queryState.add for more info.
export function * restoreWidgetsState() {
  /**
   * A regular selector, it could be on a selectors file with reselect
   * or better yet, be created automatically by the package based on registered namespace info.
  */
  function * handler () {
    const widgetsSelector = state => ({
      urlWidgets: (state.router.query && state.router.query.widgets) || null,
      stateWidgets: state.widgets.list
    });

    const {urlWidgets, stateWidgets} = yield select(widgetsSelector);

    if(urlWidgets) {
      const toDispatch = []; 
      const updatedWidgets = stateWidgets.map(widget => {
        const updatedWidget = Object.assign({}, widget);
  
        if (urlWidgets[widget.slug]) {
          const update = urlWidgets[widget.slug];
  
          if (update.isActive) {
            updatedWidget.isActive = true;
            toDispatch.push(put(toggleActive({
              id: widget.id,
              layerId: widget.layerId,
              isActive: true
            })));
          }
  
          if (update.isCollapsed) {
            updatedWidget.isCollapsed = true;
          }
        }
  
        return updatedWidget;
      });

        yield put(fetchSucceeded(updatedWidgets));
        yield call(delay, 1500);
        yield all(toDispatch);
    }
  }

  yield takeLeading(fetchSucceeded().type, handler);
}

export default function* widgetsSagas() {
  yield takeLatest('LAYERS/TOGGLE_ACTIVE', toggleWidgetActive);
  yield takeLatest('WIDGETS/FETCH_ALL', getWidgets);
}
