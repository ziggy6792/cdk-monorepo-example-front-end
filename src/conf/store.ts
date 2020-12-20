import { Reducer, AnyAction, configureStore, combineReducers } from '@reduxjs/toolkit';
import usersReducer, { UsersState } from '../domain/demo-users';
import authReducer, { AuthState } from '../domain/auth';

export interface IRootState {
  readonly users: UsersState;
  readonly auth: AuthState;
}

const reducer = combineReducers<IRootState>({
  users: usersReducer,
  auth: authReducer,
});

export interface Reducers {
  todos: Reducer<UsersState, AnyAction>;
}

export default configureStore({
  reducer,
});
