import createActionNames from './action-names';
import createActionCreators from './action-creators';

export default function (resourceName, options) {
  return {
    actions: createActionNames(resourceName),
    actionCreators: createActionCreators(resourceName, options),
  };
}
