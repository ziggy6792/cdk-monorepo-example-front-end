import { Reducer, AnyAction, configureStore, combineReducers } from '@reduxjs/toolkit';
import usersReducer, { UsersState } from '../domain/demo-users';

export interface IRootState {
  readonly users: UsersState;
}

const reducer = combineReducers<IRootState>({
  users: usersReducer,
});

export interface Reducers {
  todos: Reducer<UsersState, AnyAction>;
}

export default configureStore({
  reducer,
});
