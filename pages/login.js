import { useState } from 'react';
import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { parse } from 'cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', formData);

      setCookie('token', data.token, { maxAge: 60 * 60 * 24 });
      localStorage.setItem('username', data.data.username);
      localStorage.setItem('email', data.data.email);

      router.push('/');
    } catch (error) {
      if (error?.response?.data?.msg) {
        setErrorMsg(error?.response?.data?.msg);
      }
      console.error(error);
    }
  };

  return (
    <section className="bg-white w-screen h-screen flex items-center justify-center">
      <Card className="py-4 px-4">
        <form className="space-y-4 w-80" onSubmit={handleSubmit}>
          <div className="aspect-video w-full relative">
            <Image src={'/bglogo.png'} fill className="w-full aspect-video object-contain " />
          </div>
          <p className="text-xl text-center font-semibold  text-primary">Masuk</p>
          {errorMsg && <p className="text-red-500 text-center text-sm">{errorMsg}</p>}
          <Input label="Email" variant="bordered" color="primary" type="email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Password" variant="bordered" color="primary" type="password" name="password" value={formData.password} onChange={handleChange} />
          <Button color="primary" className="w-full" type="submit">
            Masuk
          </Button>
          <p className="text-center text-sm">
            Belum punya akun?{' '}
            <Link href={'/register'} className="hover:text-blue-400">
              Daftar disini
            </Link>
          </p>
          <p className="text-sm hover:text-blue-400 text-center">
            <Link href={'/admin/login'}>Masuk sebagai admin</Link>
          </p>
        </form>
      </Card>
    </section>
  );
};

export function getServerSideProps(context) {
  const cookie = parse(context.req.headers.cookie || '');
  const isToken = cookie.token || false;

  if (isToken)
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };

  return {
    props: { test: '' },
  };
}

export default Login;
