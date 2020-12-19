import { IRootState } from 'src/conf/store';

export const selectUsers = (state: IRootState) => state.users.users;

export const selectUsersLoading = (state: IRootState) => state.users.loading;
