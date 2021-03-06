import { combineReducers } from 'redux';
import unionBy from 'lodash.unionBy';
import createActionNames from './action-names';

export default function createReducer(resourceName, options) {
  const actions = createActionNames(resourceName);

  const customReducers = options.reducers || {};
  const loadingCustomReducers = customReducers.loading || {};
  const errorCustomReducers = customReducers.error || {};
  const itemsCustomReducers = customReducers.items || {};

  const { primaryKey = 'id' } = options;

  return combineReducers({
    loading: (state = null, action) => {
      if (loadingCustomReducers[action.type]) {
        return loadingCustomReducers[action.type](state, action);
      }

      switch (action.type) {
        case actions.findAllStart:
        case actions.findOneStart:
        case actions.createStart:
        case actions.updateStart:
        case actions.destroyStart:
          return 'loading';
        case actions.findAllSuccess:
        case actions.findOneSuccess:
        case actions.createSuccess:
        case actions.updateSuccess:
        case actions.destroySuccess:
          return null;
        case actions.findAllError:
        case actions.findOneError:
        case actions.createError:
        case actions.updateError:
        case actions.destroyError:
          return 'error';
        default:
          return state;
      }
    },

    error: (state = null, action) => {
      if (loadingCustomReducers[action.type]) {
        return errorCustomReducers[action.type](state, action);
      }

      switch (action.type) {
        case actions.findAllStart:
        case actions.findOneStart:
        case actions.createStart:
        case actions.updateStart:
        case actions.destroyStart:
          return null;
        case actions.findAllSuccess:
        case actions.findOneSuccess:
        case actions.createSuccess:
        case actions.updateSuccess:
        case actions.destroySuccess:
          return null;
        case actions.findAllError:
        case actions.findOneError:
        case actions.createError:
        case actions.updateError:
        case actions.destroyError:
          return action.data;
        default:
          return state;
      }
    },

    items: (state = [], action) => {
      if (itemsCustomReducers[action.type]) {
        return itemsCustomReducers[action.type](state, action);
      }

      switch (action.type) {
        case actions.findAllSuccess:
          return unionBy(action.data, state, primaryKey);
        case actions.findOneSuccess:
          return unionBy([action.data], state, primaryKey);
        case actions.createSuccess:
          return unionBy([action.data], state, primaryKey);
        case actions.updateSuccess:
          return unionBy([action.data], state, primaryKey);
        case actions.destroySuccess:
          return state.filter(x => x[primaryKey] === action[primaryKey]);
        default:
          return state;
      }
    }
  });
}
