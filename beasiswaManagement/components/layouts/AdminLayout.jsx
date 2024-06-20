import React, { useEffect } from 'react';
import Header from '../partials/Header';
import classNames from 'classnames';
import { Card, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

const AdminLayout = ({ title, className, children, isLoading = false }) => {
  const router = useRouter();
  const token = getCookie('token');
  const checkToken = (token) => {
    if (!token) {
      localStorage.clear();
      router.push('/admin/login');
    }
  };
  useEffect(() => {
    checkToken(token);
  }, [token]);
  return (
    <div>
      <Header />
      {isLoading && (
        <div className="h-screen w-screen flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div className="bg-white">
          <div className={classNames('md:container md:mx-auto md:mt-2')}>
            {title && (
              <div className="mb-4 p-4 ">
                <p className="text-2xl font-semibold text-primary">{title}</p>
              </div>
            )}
            <div className={classNames(className, 'px-2')}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
