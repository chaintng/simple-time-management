import 'isomorphic-fetch'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import * as actions from '../../../app/actions/job';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('contact actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates JOB_SUBMIT_SUCCESS action when form is submitted', () => {
    fetchMock.mock('/contact', 'POST', {
      body: { msg: 'Thank you! Your feedback has been submitted.' }
    });

    const expectedActions = [
      { type: 'CLEAR_MESSAGES' },
      { type: 'JOB_SUBMIT_SUCCESS', messages: [{ msg: 'Thank you! Your feedback has been submitted.' }] }
    ];

    const store = mockStore({});

    return store.dispatch(actions.submitJobForm())
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });
});
