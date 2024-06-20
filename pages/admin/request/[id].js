import AdminLayout from '@/components/layouts/AdminLayout';
import { incomeParents } from '@/lib/staticData';
import CurrencyFormatter from '@/utils/CurrencyFormatter';
import axiosInstance from '@/utils/axiosInstance';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Divider,
} from '@nextui-org/react';
import { parse } from 'cookie';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const RequestDetail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = router.query;
  const [userId, setUserId] = useState(router.query.id);

  const [userData, setUserData] = useState({});
  const [criteriaForm, setCriteriaForm] = useState([]);
  const [isLoadingcriteriaForm, setIsLoadingCriteriaForm] = useState(false);

  const { isOpen: isOpenCriteriaForm, onOpen: onOpenCriteriaForm, onOpenChange: onOpenChangeCriteriaFrom, onClose: onCloseCriteriaForm } = useDisclosure();

  const getData = async (id) => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get(`/api/admin/student/${id}`);
      setUserId(id);
      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleProcess = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get(`/api/admin/student/process/${id}`);
      setCriteriaForm(data);
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSaveProcess = async (id) => {
    try {
      await axiosInstance.post(`/api/admin/student/process/${userId}`, { evaluations: criteriaForm });
      getData(userId);
    } catch (error) {
      console.error({ error });
    } finally {
      onCloseCriteriaForm();
    }
  };

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  return (
    <AdminLayout isLoading={isLoading} title={`Detail ${userData.firstName} ${userData.lastName}`} className={'space-y-4 pb-8'}>
      <section className="space-y-4">
        <p className="text-primary text-xl font-semibold">Form</p>
        <Card className="p-4">
          {userData?.evaluationStatus === 'request' && (
            <div>
              <p className="mb-4">Process this student :</p>
              {criteriaForm.length == 0 && (
                <Button color="primary" onClick={handleProcess}>
                  Fill Criteria Form
                </Button>
              )}
              {criteriaForm.length !== 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-sm text-right">
                    <div className="col-span-2"></div>
                    <div>Bobot nilai</div>
                    <div>Maksimal nilai</div>
                  </div>
                  {criteriaForm.map(({ criteriaName, criteriaWeightValue, criteriaMaxValue, weightValue, value, criteriaResult }, index) => (
                    <div className="grid col-span-4 md:grid-cols-6  text-right gap-2 items-center">
                      <div className="col-span-2 text-left">{criteriaName}</div>
                      <div className="">
                        {criteriaWeightValue} % / {weightValue}
                      </div>
                      <div>{criteriaMaxValue}</div>
                      <div className="col-span-4 md:col-span-2 flex items-center ">
                        <Input
                          variant="bordered"
                          color="primary"
                          size="sm"
                          placeholder={`Enter ${criteriaName}`}
                          type="number"
                          name={criteriaName + 'value'}
                          value={criteriaForm[index]['value']}
                          onChange={({ target: { value: newValue } }) => {
                            if (Number(newValue) >= 0 && Number(newValue) <= criteriaMaxValue) {
                              const newCriteriaForm = [...criteriaForm];
                              newCriteriaForm[index] = {
                                ...newCriteriaForm[index],
                                value: newValue,
                                criteriaResult: Number(newValue) / criteriaMaxValue,
                                result: (Number(newValue) / criteriaMaxValue) * weightValue,
                              };
                              setCriteriaForm(newCriteriaForm);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button
                      color="primary"
                      onClick={() => {
                        onOpenCriteriaForm();
                      }}
                      isDisabled={criteriaForm.filter((item) => item.value == null).length != 0}
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          {userData?.evaluationStatus !== 'request' && (
            <div>
              <div className="mb-2">
                <p>Status : </p>
                <p className="uppercase font-semibold text-xl">{userData.evaluationStatus}</p>
              </div>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>Kriteria</TableColumn>
                  <TableColumn>Bobot</TableColumn>
                  <TableColumn>Nilai</TableColumn>
                  <TableColumn>Hasil</TableColumn>
                </TableHeader>
                <TableBody emptyContent={'No data to display.'}>
                  {userData?.evaluations?.length !== 0 &&
                    userData?.evaluations?.map(({ criteriaName, weightValue, value, result }, index) => (
                      <TableRow key={index + 1}>
                        <TableCell>{criteriaName}</TableCell>
                        <TableCell>{weightValue}</TableCell>
                        <TableCell>{value}</TableCell>
                        <TableCell>{result}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div>
                <Divider className="my-2" />
                <p>Total Skor : {userData.evaluationPoint}</p>
              </div>
            </div>
          )}
        </Card>
        <Modal isOpen={isOpenCriteriaForm} onOpenChange={onOpenChangeCriteriaFrom}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Process This Student</ModalHeader>
                <ModalBody>
                  <Table aria-label="Example static collection table" removeWrapper>
                    <TableHeader>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>Weight Value</TableColumn>
                      <TableColumn>Value</TableColumn>
                      <TableColumn>Result</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {criteriaForm.map(({ criteriaName, criteriaWeightValue, criteriaMaxValue, weightValue, value, result }, index) => (
                        <TableRow key={index + 1}>
                          <TableCell>{criteriaName}</TableCell>
                          <TableCell>{weightValue}</TableCell>
                          <TableCell>{value}</TableCell>
                          <TableCell>{result}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleSaveProcess(userId);
                    }}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
      <section className="space-y-4" id="biodata">
        <p className="text-primary text-xl font-semibold">Biodata</p>
        <Card className="p-4 space-y-4">
          <div className="table-auto">
            <div>
              <div className="grid grid-cols-3">
                <div className="text-left">Nama awal</div>
                <div className="text-left col-span-2">{userData?.firstName || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Nama akhir</div>
                <div className="text-left col-span-2">{userData?.lastName || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Username</div>
                <div className="text-left col-span-2">{userData?.user?.username || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Email</div>
                <div className="text-left col-span-2">{userData?.user?.email || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">NIM</div>
                <div className="text-left col-span-2">{userData?.nim || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">IPK</div>
                <div className="text-left col-span-2">{userData?.gpa || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Tempat lahir</div>
                <div className="text-left col-span-2">{userData?.pob || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Tanggal lahir</div>
                <div className="text-left col-span-2">{dayjs(userData?.dob).format('DD MMM YYYY') || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Gender</div>
                <div className="text-left col-span-2">{userData?.gender || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Address</div>
                <div className="text-left col-span-2">{userData?.address || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <p className="font-semibold mt-4 underline">Ayah</p>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Nama</div>
                <div className="text-left col-span-2">{userData?.fatherName || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Pekerjaan</div>
                <div className="text-left col-span-2">{userData?.fatherJob || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Penghasilan</div>
                <div className="text-left col-span-2">{userData?.fatherIncome ? incomeParents.find(({ value }) => value == userData?.fatherIncome).name : '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <p className="font-semibold mt-4 underline ">Mother</p>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Nama</div>
                <div className="text-left col-span-2">{userData?.motherName || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Pekerjaan</div>
                <div className="text-left col-span-2">{userData?.motherJob || '-'}</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="text-left">Penghasilan</div>
                <div className="text-left col-span-2">{userData?.motherIncome ? incomeParents.find(({ value }) => value == userData?.motherIncome).name : '-'}</div>
              </div>
            </div>
          </div>
        </Card>
      </section>
      <section className="space-y-4" id="grades">
        <p className="text-primary text-xl font-semibold">Nilai</p>
        <Card className="p-4 space-y-4">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Semester</TableColumn>
              <TableColumn>IP</TableColumn>
            </TableHeader>
            <TableBody emptyContent={'No rows to display.'}>
              {userData?.grades?.length !== 0 &&
                userData?.grades?.map(({ semester, cumulativeGpa }, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{semester}</TableCell>
                    <TableCell>{cumulativeGpa}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </section>
      <section className="space-y-4" id="achievements">
        <p className="text-primary text-xl font-semibold">Prestasi</p>
        <Card className="p-4 space-y-4">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Prestasi</TableColumn>
              <TableColumn>Tahun</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
            </TableHeader>
            <TableBody emptyContent={'No data to display.'}>
              {userData?.achievements?.length !== 0 &&
                userData?.achievements?.map(({ achievement, year, description, id }, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{achievement}</TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell>{description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </section>
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

export default RequestDetail;
