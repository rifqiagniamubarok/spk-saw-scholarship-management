import { Button, Spinner } from '@nextui-org/react';
import classNames from 'classnames';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';

const StudentLayout = ({ className, children, isLoading }) => {
  const router = useRouter();
  const [username, setUsername] = useState('student');

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const token = getCookie('token');
  const checkToken = (token) => {
    if (!token) {
      localStorage.clear();
      router.push('/login');
    }
  };

  useEffect(() => {
    checkToken(token);
  }, [token]);

  const handleLogout = () => {
    deleteCookie('token');
    localStorage.clear();
    router.push('/login');
  };
  return (
    <div>
      <div className="w-screen bg-primary text-white p-4 ">
        <div className="md:container md:mx-auto flex justify-between items-center">
          <div>
            <p className="text-2xl capitalize">Halo, {username}</p>
          </div>
          <div>
            <Button color="danger" onClick={handleLogout}>
              Keluar
              <IoIosLogOut />
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-4 min-h-screen bg-white">
        {isLoading && (
          <div className="h-screen w-screen flex justify-center items-center">
            <Spinner />
          </div>
        )}
        {!isLoading && <div className={classNames(className, 'px-2')}>{children}</div>}
      </div>
    </div>
  );
};

export default StudentLayout;
