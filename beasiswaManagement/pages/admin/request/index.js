import AdminLayout from '@/components/layouts/AdminLayout';
import axiosInstance from '@/utils/axiosInstance';
import truncateFloat from '@/utils/truncateFloat';
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@nextui-org/react';
import classNames from 'classnames';
import { parse } from 'cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCompress } from 'react-icons/fa';

const Request = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data },
      } = await axiosInstance.get('/api/admin/student', { params: { status: `request,process` } });
      setStudents(data);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminLayout title={'Permintaan / Request'} isLoading={isLoading}>
      <Card className="p-4">
        <Table aria-label="Example static collection table" removeWrapper>
          <TableHeader>
            <TableColumn>Nama</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>NIM</TableColumn>
            <TableColumn>IPK</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody emptyContent="No requests">
            {students.length !== 0 &&
              students.map(({ id, firstName, lastName, nim, gpa, evaluationStatus }, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{firstName + ' ' + lastName}</TableCell>
                  <TableCell className={classNames(evaluationStatus == 'request' ? 'text-yellow-500' : 'text-sky-500', 'capitalize')}>{evaluationStatus}</TableCell>
                  <TableCell>{nim}</TableCell>
                  <TableCell>{truncateFloat(gpa)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/request/${id}`}>
                      <Button variant="faded" color="primary" size="sm">
                        <FaCompress /> Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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

export default Request;
