import createActionNames from './action-names';

export function createPOJOActionCreator(actionNames, action) {
  return data => ({
    type: actionNames[action],
    data,
  });
}

const parseResponse = (r) => {
  if (r.ok) {
    return r.json();
  }

  return Promise.reject(r.json());
};

export default function createActionCreators(resourceName, options) {
  const actionNames = createActionNames(resourceName);

  const actions = {};

  for (const actionName in actionNames) {
    if (actionNames.hasOwnProperty(actionName)) {
      actions[actionName] = createPOJOActionCreator(actionNames, actionName);
    }
  }

  actions.findAll = () => (dispatch) => {
    dispatch(actions.findAllStart());

    return fetch(options.url)
      .then(parseResponse)
      .then((data) => {
        dispatch(actions.findAllSuccess(data));
      })
      .catch((err) => {
        dispatch(actions.findAllError(err));
      });
  };

  return actions;
}
