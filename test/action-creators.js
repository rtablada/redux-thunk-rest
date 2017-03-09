import sinon from 'sinon';
import chai from 'chai';
import stubPromise from 'sinon-stub-promise';

import createActionCreators, {
  createPOJOActionCreator
 } from '../src/action-creators';


const expect = chai.expect;
stubPromise(sinon);

beforeEach(() => {
  global.fetch = () => {};
});

afterEach(() => {
  delete global.fetch;
});

describe('createPOJOActionCreator', () => {
  it('can create a POJO action creator for findAllStart', () => {
    const actionCreator = createPOJOActionCreator({ findAllStart: 'BOOK@FINDALL_START' }, 'findAllStart');
    const data = { name: 'hello' };

    expect(actionCreator(data))
      .to.deep.equal({ type: 'BOOK@FINDALL_START', data: { name: 'hello' } });
  });
});

describe('createActionCreators', () => {
  it('can create actions for using POJOs', () => {
    const actions = createActionCreators('books', {});
    const data = { name: 'hello' };
    const findAll = actions.findAllSuccess;

    expect(findAll(data))
      .to.deep.equal({ type: 'BOOK@FINDALL_SUCCESS', data: { name: 'hello' } });
  });

  it('can create an action for findall', (done) => {
    const spyDispatch = sinon.spy();
    const spyFetch = sinon.stub(global, 'fetch');

    const actions = createActionCreators('books', {});
    const data = [{ title: 'Rainbow Six', id: 1 }];

    spyFetch.returnsPromise().resolves({
      ok: true,
      json: () => data,
    });

    const findAllThunk = actions.findAll();

    findAllThunk(spyDispatch).then(() => {
      const findallStart = spyDispatch.getCall(0);
      const findallComplete = spyDispatch.getCall(1);

      expect(findallStart.args[0])
        .to.deep.equal({ type: 'BOOK@FINDALL_START', data: undefined });
      expect(findallComplete.args[0])
        .to.deep.equal({ type: 'BOOK@FINDALL_SUCCESS', data });

      done();
    });
  });

  it('can create an action for findall error', (done) => {
    const spyDispatch = sinon.spy();
    const spyFetch = sinon.stub(global, 'fetch');

    const actions = createActionCreators('books', {});
    const error = { err: 'NOPE' };

    spyFetch.returnsPromise().resolves({
      ok: false,
      json: () => error,
    });

    const findAllThunk = actions.findAll();

    findAllThunk(spyDispatch).then(() => {
      const findallStart = spyDispatch.getCall(0);
      const findallComplete = spyDispatch.getCall(1);

      expect(findallStart.args[0])
        .to.deep.equal({ type: 'BOOK@FINDALL_START', data: undefined });
      expect(findallComplete.args[0])
        .to.deep.equal({ type: 'BOOK@FINDALL_ERROR', data: error });

      done();
    });
  });
});
