import { createAsyncThunk, createSlice, SerializedError, PayloadAction } from '@reduxjs/toolkit';
import User from './user';
import MyKnownError from './my-known-error';

export interface UsersState {
  loading: boolean;
  error: SerializedError | string;
  users: User[];
  selectedUserId: number | null;
}

const getUsers = createAsyncThunk<
  // Return type of the payload creator
  User[],
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  {
    rejectValue: MyKnownError;
  }
>('users/getUsers', async (endpoint: string, thunkApi) => {
  await new Promise((r) => setTimeout(r, 5000));
  const response = await fetch(endpoint);
  if (!response.ok) return thunkApi.rejectWithValue((await response.json()) as MyKnownError);
  const toJson = await response.json();
  return toJson;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    error: '',
    users: [],
    selectedUserId: null,
  } as UsersState,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: number }>) => {
      state.selectedUserId = payload.id;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUsers.rejected, (state, action: any) => {
      if (action.payload) {
        // Since we passed in `MyKnownError` to `rejectType` in `updateUser`, the type information will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = payload;
    });
  },
});

// Export Actions

export const getUsersActionCreator = getUsers;

export const { select: selectUserActionCreator } = usersSlice.actions;

export default usersSlice.reducer;
