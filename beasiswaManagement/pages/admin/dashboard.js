import AdminLayout from '@/components/layouts/AdminLayout';
import axiosInstance from '@/utils/axiosInstance';
import truncateFloat from '@/utils/truncateFloat';
import { Card, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import classNames from 'classnames';
import { parse } from 'cookie';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    request: 0,
    accepted: 0,
    rejected: 0,
    maxPage: 1,
  });
  const [page, setPage] = useState(1);
  const getData = async (page) => {
    try {
      setIsLoading(true);
      const {
        data: { data, info },
      } = await axiosInstance.get('/api/admin/dashboard', { params: { page } });
      setStudents(data);
      setSummary(info);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const statusStyle = {
    not_sent: 'text-gray-600',
    request: 'text-yellow-600',
    process: 'text-blue-600',
    accepted: 'text-emerald-600',
    rejected: 'text-red-600',
  };

  return (
    <AdminLayout isLoading={isLoading} title={'Dashboard'} className={'md:mx-auto md:container grid grid-cols-4 gap-4'}>
      <Card className="p-4 col-span-2 md:col-span-1">
        <p className="text-xs md:text-base">Mahasiswa terdaftar</p>
        <p className="text-xl md:text-4xl font-semibold text-blue-600">{summary.total}</p>
      </Card>
      <Card className="p-4 col-span-2 md:col-span-1">
        <p className="text-xs md:text-base">permintaan</p>
        <p className="text-xl md:text-4xl font-semibold text-yellow-600">{summary.request}</p>
      </Card>
      <Card className="p-4 col-span-2 md:col-span-1">
        <p className="text-xs md:text-base">Diterima</p>
        <p className="text-xl md:text-4xl font-semibold text-emerald-600">{summary.accepted}</p>
      </Card>
      <Card className="p-4 col-span-2 md:col-span-1">
        <p className="text-xs md:text-base">Ditolak</p>
        <p className="text-xl md:text-4xl font-semibold text-red-600">{summary.rejected}</p>
      </Card>
      <Card className="col-span-4 p-4">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Nama</TableColumn>
            <TableColumn className="text-center">NIM</TableColumn>
            <TableColumn className="text-end">IPK</TableColumn>
            <TableColumn className="text-center">Status</TableColumn>
          </TableHeader>
          <TableBody emptyConten="No data">
            {students.map(({ firstName, lastName, nim, gpa, evaluationStatus }, index) => (
              <TableRow key={index + 1}>
                <TableCell>
                  {firstName} {lastName}
                </TableCell>
                <TableCell className="text-center">{nim || '-'}</TableCell>
                <TableCell className="text-end">{truncateFloat(Number(gpa))}</TableCell>
                <TableCell className={classNames(statusStyle[evaluationStatus], 'text-center')}>{evaluationStatus || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center">
          {summary.maxPage > 1 && (
            <Pagination
              showControls
              total={summary.maxPage}
              initialPage={1}
              page={page}
              onChange={(newPage) => {
                setPage(newPage);
              }}
            />
          )}
        </div>
      </Card>
    </AdminLayout>
  );
};

export function getServerSideProps(context) {
  const cookie = parse(context.req.headers.cookie || '');
  const isToken = cookie.token || false;

  if (!isToken)
    return {
      redirect: {
        permanent: false,
        destination: '/admin/login',
      },
    };

  return {
    props: { test: '' },
  };
}

export default Dashboard;
