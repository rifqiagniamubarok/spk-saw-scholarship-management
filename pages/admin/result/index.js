import AdminLayout from '@/components/layouts/AdminLayout';
import ExcelExport from '@/components/reusable/ExcelExport';
import PdfExport from '@/components/reusable/PdfExport';
import axiosInstance from '@/utils/axiosInstance';
import truncateFloat from '@/utils/truncateFloat';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import classNames from 'classnames';
import { parse } from 'cookie';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowsAlt, FaCompress } from 'react-icons/fa';

const Result = () => {
  const [students, setStudents] = useState([]);
  const [dataForExport, setDataForExport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailStudent, setDetailStudent] = useState(null);

  const { isOpen: isOpenCriteriaView, onOpen: onOpenCriteriaView, onOpenChange: onOpenChangeCriteriaView, onClose: onCloseCriteriaForm } = useDisclosure();

  const sytleStatus = {
    process: 'text-gray-500',
    accepted: 'text-green-500',
    rejected: 'text-red-500',
  };
  const getData = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get('/api/admin/student', { params: { status: `process,accepted,rejected` } });
      setStudents(data);

      let dataExport = data.map(({ firstName, lastName, nim, gpa, evaluations, evaluationPoint }, hIdx) => {
        let payload = { A: hIdx + 1, firstName, lastName, nim, gpa };
        evaluations.map(({ criteriaName, weightValue, value, result }, index) => {
          payload[`W${index + 1}`] = weightValue;
          payload[`C${index + 1}`] = value;
          payload[`C${index + 1} Skor`] = result;
        });

        payload['Score'] = evaluationPoint;

        return payload;
      });

      setDataForExport(dataExport);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axiosInstance.post(`/api/admin/student/finish/${id}`, { status: 'accepted' });
      getData();
    } catch (error) {
      console.error({ error });
    } finally {
      onCloseCriteriaForm();
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.post(`/api/admin/student/finish/${id}`, { status: 'rejected' });
      getData();
    } catch (error) {
      console.error({ error });
    } finally {
      onCloseCriteriaForm();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminLayout isLoading={isLoading} title={'Hasil / Result'}>
      <Card className="p-4">
        <div className="mb-4 flex justify-end gap-2">
          <PdfExport data={dataForExport} fileName={`result_${dayjs(new Date()).format('YYYY-MM-DD_HH-mm')}`} variant="faded" color="warning" />
          <ExcelExport data={dataForExport} isIconOnly fileName={`result_${dayjs(new Date()).format('YYYY-MM-DD_HH-mm')}`} color="success" variant="faded" />
        </div>
        <Table aria-label="Example static collection table overflow-auto" removeWrapper>
          <TableHeader>
            <TableColumn>Nama</TableColumn>
            <TableColumn className="hidden md:table-cell">NIM</TableColumn>
            <TableColumn className="hidden md:table-cell">IPK</TableColumn>
            <TableColumn>Skor</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody emptyContent="No requests">
            {students.length !== 0 &&
              students.map((stu, index) => {
                let { id, firstName, lastName, nim, gpa, evaluationPoint, evaluationStatus } = stu;
                return (
                  <TableRow key={index + 1}>
                    <TableCell>{firstName + ' ' + lastName}</TableCell>
                    <TableCell className="hidden md:table-cell">{nim}</TableCell>
                    <TableCell className="hidden md:table-cell">{truncateFloat(Number(gpa))}</TableCell>
                    <TableCell>{truncateFloat(evaluationPoint)}</TableCell>
                    <TableCell className={classNames(sytleStatus[evaluationStatus])}>{evaluationStatus}</TableCell>
                    <TableCell className="space-2 flex justify-end gap-2">
                      <Button
                        variant="faded"
                        color="primary"
                        size="sm"
                        onClick={() => {
                          setDetailStudent(stu);
                          onOpenCriteriaView();
                        }}
                      >
                        <FaArrowsAlt /> Detail
                      </Button>

                      {/* <Link href={`/admin/request/${id}`}>
                      <Button variant="faded" color="primary" size="sm">
                        <FaCompress /> Detail
                      </Button>
                    </Link> */}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
      <Modal isOpen={isOpenCriteriaView} onOpenChange={onOpenChangeCriteriaView}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail {detailStudent.firstName} {detailStudent.lastName}
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="mb-4">
                    <Link href={`/admin/request/${detailStudent.id}`} className="text-blue-400 underline hover:text-blue-300">
                      Lihat biodata {detailStudent.firstName} {detailStudent.lastName}
                    </Link>
                  </div>
                  <Table removeWrapper>
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn>Bobot</TableColumn>
                      <TableColumn>Nama</TableColumn>
                      <TableColumn>Niali</TableColumn>
                      <TableColumn>C Skor</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {detailStudent.evaluations.map(({ criteriaName, weightValue, value, result }, index) => {
                        return (
                          <TableRow key={index + 1}>
                            <TableCell>C{index + 1}</TableCell>
                            <TableCell>{weightValue}</TableCell>
                            <TableCell>{criteriaName}</TableCell>
                            <TableCell>{value}</TableCell>
                            <TableCell>{result}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <p className="mt-4 text-lg  md:text-xl">Total skor : {truncateFloat(detailStudent.evaluationPoint)}</p>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    {detailStudent.evaluationStatus == 'process' && (
                      <>
                        <Button
                          color="success"
                          onClick={() => {
                            handleAccept(detailStudent.id);
                          }}
                        >
                          Terima
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => {
                            handleReject(detailStudent.id);
                          }}
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                    {detailStudent.evaluationStatus == 'accepted' && <p className="text-green-500 text-lg md:text-xl">Diterima</p>}
                    {detailStudent.evaluationStatus == 'rejected' && <p className="text-red-500 text-lg md:text-xl">Ditolak</p>}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => {
                    setDetailStudent(null);
                    onClose();
                  }}
                >
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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

export default Result;
