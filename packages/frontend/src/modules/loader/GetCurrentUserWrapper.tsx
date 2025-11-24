import React, { useEffect, useState } from 'react';
import { cookieStorage } from '@src/utils/cookie-storage';
import { useGetCurrentUser } from '@src/modules/auth/hooks/useGetCurrentUser';

type MyWrapperProps = {
  children: React.ReactNode;
};

const GetCurrentUserWrapper: React.FC<MyWrapperProps> = ({ children }) => {
  const accessToken = cookieStorage.getItem('tokenPair')
  const { getCurrentUser } = useGetCurrentUser()
  useEffect(() => {
    const loadCurrentUserNow = async () => {
      if (accessToken) {
        await getCurrentUser()
      }
    }
    loadCurrentUserNow()
  }, [accessToken]);

  return (
    <div>
      {children}
    </div>
  );
};

export default GetCurrentUserWrapper;
