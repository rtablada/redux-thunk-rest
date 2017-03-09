import chai from 'chai';
const expect = chai.expect;

import actionNames from '../src/action-names';

describe('createActionNames', () => {
  it('can create action names for a single word', () => {
    expect(actionNames('book')).to.deep.equal({
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

      deleteStart: 'BOOK@DELETE_START',
      deleteSuccess: 'BOOK@DELETE_SUCCESS',
      deleteError: 'BOOK@DELETE_ERROR',
    });
  });
});
