import { connect } from 'react-redux';
import { setUi } from 'modules/widgets/actions';
import { fetchMangroveHabitatExtentData } from 'modules/mangrove-habitat-extent-data/actions';

import Component from './component';

const mapStateToProps = state => ({
  isLoading: state.mangroveHabitatExtentData.isLoading,
  data: state.mangroveHabitatExtentData,
  ui: state.widgets.ui.coverage || {
    currentYear: 2016,
    unit: 'km'
  }
});
const mapDispatchToProps = {
  setUi,
  fetchMangroveHabitatExtentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
