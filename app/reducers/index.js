import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import job from './job';
import global from './global';

export default combineReducers({
  messages,
  auth,
  job,
  global
});
