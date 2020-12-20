/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsersActionCreator, selectUserActionCreator } from 'src/domain/demo-users/index';
import { selectUsers, selectUsersLoading } from 'src/domain/demo-users/selectors';

const DemoUsers: React.FC = () => {
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsersActionCreator('http://jsonplaceholder.typicode.com/users/'));
  }, [dispatch]);

  const Spinner = () => {
    // Proton spinner?
    return <div>Lodinng...</div>;
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div style={{ padding: '100px 100px 100px 100px' }}>
          {users.map((user) => {
            const { id, name, email } = user;
            return (
              <div key={id}>
                <div>
                  {id} {name} {email}
                </div>
                <Button
                  onClick={async () => {
                    console.log('clicked');
                    dispatch(selectUserActionCreator({ id }));
                  }}
                >
                  Select
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DemoUsers;
