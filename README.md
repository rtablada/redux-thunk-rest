# Redux Thunk Rest

> **NOTE** This module is still a work in progress and has not been completed yet.

This package is helps remove some of the boilerplate cruft for creating RESTful actions, action creators, and reducers for Redux with Redux Thunk.

## Installation

```bash
yarn add redux-thunk-rest
```

## Use

Using the `reduxThunkRest` function from this package will create an object with:

* Actions
* Action Creators
* Reducer

To work with resourceful REST APIs.

```js
import createResource from 'redux-thunk-rest';

const { actions, actionCreators, reducer } = createResource('book', {
  url: 'http://myapi.com/api/books'
});
```

This code will create:

```js
actions = {
  findAllStart: 'BOOK@FINDALL_START',
  findAllSuccess: 'BOOK@FINDALL_SUCCESS',
  findAllError: 'BOOK@FINDALL_ERROR',

  findOneStart: 'BOOK@FINDONE_START',
  findOneSuccess: 'BOOK@FINDONE_SUCCESS',
  findOneError: 'BOOK@FINDONE_ERROR',

  createStart: 'BOOK@CREATE_START',
  createSuccess: 'BOOK@CREATE_SUCCESS',
  createError: 'BOOK@CREATE_ERROR',

  updateStart: 'BOOK@UPDATE_START',
  updateSuccess: 'BOOK@UPDATE_SUCCESS',
  updateError: 'BOOK@UPDATE_ERROR',

  destroyStart: 'BOOK@DESTROY_START',
  destroySuccess: 'BOOK@DESTROY_SUCCESS',
  destroyError: 'BOOK@DESTROY_ERROR',
};

actionCreators = {
  {
    findAll: () => (dispatch) => {
      dispatch({ type: action.findAllStart })
      fetch('http://myapi.com/api/books')
        .then(parseJson) // Parse JSON data for success requests or reject and parse error JSON
        .then((d) => dispatch(actionCreators.findAllSuccess(d)))
        .catch((d) => dispatch(actionCreators.findAllError(d)));
    },
    findAllStart: (data) => ({ type: actions.findAllStart, data }),
    findAllSuccess: (data) => ({ type: actions.findAllSuccess, data }),
    findAllError: (data) => ({ type: actions.findAllError, data }),

    findOne: (id) => (dispatch) => {
      dispatch({ type: action.findAllStart })
      fetch(`http://myapi.com/api/books/${id}`)
        .then(parseJson) // Parse JSON data for success requests or reject and parse error JSON
        .then((d) => dispatch(actionCreators.findOneSuccess(d)))
        .catch((d) => dispatch(actionCreators.findOneError(d)));
    },
    findOneStart: (data) => ({ type: actions.findOneStart, data }),
    findOneSuccess: (data) => ({ type: actions.findOneSuccess, data }),
    findOneError: (data) => ({ type: actions.findOneError, data }),

    create: (formValues) => (dispatch) => {
      dispatch({ type: action.findAllStart })
      fetch(`http://myapi.com/api/books`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then(parseJson) // Parse JSON data for success requests or reject and parse error JSON
        .then((d) => dispatch(actionCreators.createSuccess(d)))
        .catch((d) => dispatch(actionCreators.createError(d)));
    },
    createStart: (data) => ({ type: actions.createStart, data }),
    createSuccess: (data) => ({ type: actions.createSuccess, data }),
    createError: (data) => ({ type: actions.createError, data }),

    create: (id, formValues) => (dispatch) => {
      dispatch({ type: action.findAllStart })
      fetch(`http://myapi.com/api/books/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      }).then(parseJson) // Parse JSON data for success requests or reject and parse error JSON
        .then((d) => dispatch(actionCreators.updateSuccess(d)))
        .catch((d) => dispatch(actionCreators.updateError(d)));
    },
    updateStart: (data) => ({ type: actions.updateStart, data }),
    updateSuccess: (data) => ({ type: actions.updateSuccess, data }),
    updateError: (data) => ({ type: actions.updateError, data }),

    destroy: (id) => (dispatch) => {
      dispatch({ type: action.findAllStart })
      fetch(`http://myapi.com/api/books/${id}`, {
        method: 'DELETE',
      }).then((d) => dispatch(actionCreators.updateSuccess(d)))
        .catch((d) => dispatch(actionCreators.updateError(d)));
    },
    destroyStart: (data) => ({ type: actions.destroyStart, data }),
    destroySuccess: (data) => ({ type: actions.destroySuccess, data }),
    destroyError: (data) => ({ type: actions.destroyError, data }),
  }
};

reducer = combineReducers({
  loading: (state = null, action) => { ... } // Changes loading state to null, "start", or "error" depending on actions
  error: (state = null, action) => { ... } // Changes adds parsed JSON error information on "error" clears on start/success action
  items: (state = [], action) => {
    switch (action.type) {
      case actions.findAllSuccess:
        return _.unionBy(action.data, state, 'id');
      case actions.findOneSuccess:
        return _.unionBy([action.data], state, 'id');
      case actions.createSuccess:
        return _.unionBy([action.data], state, 'id');
      case actions.updateSuccess:
        return _.unionBy([action.data], state, 'id');
      case actions.destroySuccess:
        return state.filter((x) => x.id === action.id);
      default:
        return state;
    }
  },
});
```

## Customization

There are some basic ways to customize the reducers and action creators created by `createResource`:

### Customizing The Primary Key

Some servers do use `id` as the primary key for resources.
In the options object, a `primaryKey` property can be passed to customize the primaryKey that is used for `unionBy` de-duplication.

Ex.

```js
const { actions, actionCreators, reducer } = createResource('book', {
  url: 'http://myapi.com/api/posts',
  primaryKey: 'slug'
});
```

### Customizing The Reducers

To add custom reducers to the reducer created by `createResource`, a `reducers` object with custom action types can be added to customize the reducer for both `loading` and `items`.

Ex.

```js
const { actions, actionCreators, reducer } = createResource('book', {
  url: 'http://myapi.com/api/books',
  reducers: {
    items: {
      'BOOKS@CLEAR': (state, action) => return [];
    }
  }
});
```
