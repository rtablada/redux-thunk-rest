import createActionNames from './action-names';
import createActionCreators from './action-creators';
import createReducer from './reducer';

export default function (resourceName, options) {
  return {
    actions: createActionNames(resourceName),
    actionCreators: createActionCreators(resourceName, options),
    reducer: createReducer(resourceName, options),
  };
}
