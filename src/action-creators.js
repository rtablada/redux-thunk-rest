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

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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

    const baseUrl = options.findAllUrl || options.url;

    return fetch(baseUrl)
      .then(parseResponse)
      .then((data) => {
        dispatch(actions.findAllSuccess(data));
      }).catch((err) => {
        dispatch(actions.findAllError(err));
      });
  };

  actions.findOne = id => (dispatch) => {
    dispatch(actions.findOneStart());

    const baseUrl = options.findOneUrl || options.url;

    return fetch(`${baseUrl}/${id}`)
      .then(parseResponse)
      .then((data) => {
        dispatch(actions.findOneSuccess(data));
      }).catch((err) => {
        dispatch(actions.findOneError(err));
      });
  };

  actions.create = formData => (dispatch) => {
    dispatch(actions.createStart());

    const baseUrl = options.createUrl || options.url;

    return fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.createSuccess(data));
      }).catch((err) => {
        dispatch(actions.createError(err));
      });
  };

  actions.update = (id, formData) => (dispatch) => {
    dispatch(actions.updateStart());

    const baseUrl = options.updateUrl || options.url;

    return fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(formData),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.updateSuccess(data));
      }).catch((err) => {
        dispatch(actions.updateError(err));
      });
  };

  actions.detstroy = id => (dispatch) => {
    dispatch(actions.detstroyStart());

    const baseUrl = options.detstroyUrl || options.url;

    return fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    }).then((data) => {
      dispatch(actions.detstroySuccess(data));
    }).catch((err) => {
      dispatch(actions.detstroyError(err));
    });
  };

  return actions;
}
