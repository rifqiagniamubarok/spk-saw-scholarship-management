import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nim: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nim' ? Number(value) : value,
    });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      router.push('/login');
    } catch (error) {
      console.error('An error occurred:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <section className="bg-white w-screen h-screen flex items-center justify-center">
      <Card className="py-4 px-4">
        <div className="aspect-video w-full relative">
          <Image src={'/bglogo.png'} fill className="w-full aspect-video object-contain " />
        </div>
        <form className="space-y-4 w-80" onSubmit={handlerSubmit}>
          <p className="text-xl text-center font-semibold  text-primary">Daftar</p>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Nama depan" variant="bordered" color="primary" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Nama akhir" variant="bordered" color="primary" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <Input label="NIM" variant="bordered" color="primary" type="number" name="nim" value={formData.nim} onChange={handleChange} />
          <Input label="Username" variant="bordered" color="primary" type="text" name="username" value={formData.username} onChange={handleChange} />
          <Input label="Email" variant="bordered" color="primary" type="email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Password" variant="bordered" color="primary" type="password" name="password" value={formData.password} onChange={handleChange} />
          <Button color="primary" className="w-full" type="submit">
            Register
          </Button>
          <p className="text-center text-sm">
            Sudah punya akun?{' '}
            <Link href={'/login'} className="hover:text-blue-400">
              Masuk disini
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

export default Register;
