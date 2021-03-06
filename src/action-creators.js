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

function buildHeaders(createHeaders) {
  return Object.assign({}, headers, createHeaders());
}

function catchError(dispatch, actionCreator) {
  return (err) => {
    if (err && err.then) {
      return err.then((data) => {
        dispatch(actionCreator(data));

        throw data;
      });
    } else {
      throw err;
    }
  };
}

export default function createActionCreators(resourceName, options) {
  const actionNames = createActionNames(resourceName);
  const createHeaders = options.createHeaders || (() => ({}));

  const actions = {};

  for (const actionName in actionNames) {
    if (actionNames.hasOwnProperty(actionName)) {
      actions[actionName] = createPOJOActionCreator(actionNames, actionName);
    }
  }

  actions.findAll = () => (dispatch) => {
    dispatch(actions.findAllStart());

    const baseUrl = options.findAllUrl || options.url;

    return fetch(baseUrl, {
      method: 'GET',
      headers: buildHeaders(createHeaders),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.findAllSuccess(data));
      }).catch(catchError(dispatch, actions.findAllError));
  };

  actions.findOne = id => (dispatch) => {
    dispatch(actions.findOneStart());

    const baseUrl = options.findOneUrl || options.url;

    return fetch(`${baseUrl}/${id}`, {
      method: 'GET',
      headers: buildHeaders(createHeaders),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.findOneSuccess(data));
      }).catch(catchError(dispatch, actions.findOneError));
  };

  actions.create = formData => (dispatch) => {
    dispatch(actions.createStart());

    const baseUrl = options.createUrl || options.url;

    return fetch(baseUrl, {
      method: 'POST',
      headers: buildHeaders(createHeaders),
      body: JSON.stringify(formData),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.createSuccess(data));
      }).catch(catchError(dispatch, actions.createError));
  };

  actions.update = (id, formData) => (dispatch) => {
    dispatch(actions.updateStart());

    const baseUrl = options.updateUrl || options.url;

    return fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: buildHeaders(createHeaders),
      body: JSON.stringify(formData),
    }).then(parseResponse)
      .then((data) => {
        dispatch(actions.updateSuccess(data));
      }).catch(catchError(dispatch, actions.updateError));
  };

  actions.detstroy = id => (dispatch) => {
    dispatch(actions.detstroyStart());

    const baseUrl = options.detstroyUrl || options.url;

    return fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(createHeaders),
    }).then((data) => {
      dispatch(actions.detstroySuccess(data));
    }).catch(catchError(dispatch, actions.detstroyError));
  };

  return actions;
}
