import { Button, Card, DatePicker, Divider, Input, Radio, RadioGroup, Select, SelectItem, Textarea } from '@nextui-org/react';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import StudentLayout from '@/components/layouts/StudentLayout';

import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { incomeParents } from '@/lib/staticData';

const Edit = () => {
  const router = useRouter();
  const [dataUser, setDataUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getUser = async () => {
    try {
      setIsLoading(true);
      const {
        data: {
          data: { username, email, student },
        },
      } = await axiosInstance.get('/api/student');
      setIsLoading(false);

      setDataUser({ username, email, ...student });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUser({
      ...dataUser,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.put('/api/student', dataUser);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <StudentLayout isLoading={isLoading} className={'container mx-auto pb-8'}>
      <Button className="" color="primary" variant="faded">
        <Link href={'/'}>Kembali</Link>
      </Button>
      <p className="font-semibold text-2xl my-4 text-primary">Edit data</p>
      <form onSubmit={handleSave}>
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Nama depan</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.firstName || ''} onChange={handleChange} name="firstName" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Nama belakang</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.lastName || ''} onChange={handleChange} name="lastName" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Username</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.username || ''} onChange={handleChange} name="username" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Email</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.email || ''} onChange={handleChange} name="email" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">NIM</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" type="number" value={dataUser?.nim || ''} onChange={handleChange} name="nim" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Tempat lahir</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.pob || ''} onChange={handleChange} name="pob" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Tanggal lahir</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <DatePicker
                  variant="bordered"
                  color="primary"
                  name="dob"
                  onChange={(value) => {
                    let dob = dayjs(value);
                    setDataUser({ ...dataUser, dob: dob.$d });
                  }}
                  isRequired={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Jenis kelamin</div>
              <RadioGroup orientation={'horizontal'} color="primary" name="gender" value={dataUser?.gender || ''} onChange={handleChange} isRequired={true}>
                <Radio value="laki-laki">Laki laki</Radio>
                <Radio value="perempuan">Perempuan</Radio>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Alamat</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Textarea variant="bordered" color="primary" value={dataUser?.address || ''} onChange={handleChange} name="address" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <p className="font-semibold mt-4 underline">Ayah</p>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Nama</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.fatherName || ''} onChange={handleChange} name="fatherName" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Pekerjaan</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.fatherJob || ''} onChange={handleChange} name="fatherJob" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Penghasilan</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                {/* <Input variant="bordered" type="number" color="primary" value={dataUser?.fatherIncome || ''} onChange={handleChange} name="fatherIncome" isRequired={true} /> */}
                <Select
                  variant="bordered"
                  color="primary"
                  label="Pilih penghasilan"
                  selectionMode="single"
                  onChange={({ target: { value } }) => {
                    setDataUser({ ...dataUser, fatherIncome: value });
                  }}
                >
                  {incomeParents.map((income) => (
                    <SelectItem key={income.value}>{income.name}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <p className="font-semibold mt-4 underline ">Ibu</p>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Nama</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.motherName || ''} onChange={handleChange} name="motherName" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Pekerjaan</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                <Input variant="bordered" color="primary" value={dataUser?.motherJob || ''} onChange={handleChange} name="motherJob" isRequired={true} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="text-left">Penghasilan</div>
              <div className="col-span-3 md:col-span-2 lg:col-span-1 ">
                {/* <Input variant="bordered" type="number" color="primary" value={dataUser?.motherIncome || ''} onChange={handleChange} name="motherIncome" isRequired={true} /> */}
                <Select
                  variant="bordered"
                  color="primary"
                  label="Pilih penghasilan "
                  selectionMode="single"
                  onChange={({ target: { value } }) => {
                    setDataUser({ ...dataUser, motherIncome: value });
                  }}
                >
                  {incomeParents.map((incom) => (
                    <SelectItem key={incom.value}>{incom.name}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" color="primary" className="mt-4">
            Simpan
          </Button>
        </div>
      </form>
    </StudentLayout>
  );
};

export function getServerSideProps(context) {
  const cookie = parse(context.req.headers.cookie || '');
  const isToken = cookie.token || false;

  if (!isToken)
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };

  return {
    props: { test: '' },
  };
}

export default Edit;
