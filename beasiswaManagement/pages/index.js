import {
  Button,
  Card,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import StudentLayout from '@/components/layouts/StudentLayout';

import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { IoMdAdd } from 'react-icons/io';
import CurrencyFormatter from '@/utils/CurrencyFormatter';
import classNames from 'classnames';
import { incomeParents } from '@/lib/staticData';
import dayjs from 'dayjs';

const requestList = {
  not_sent: { style: 'text-gray-400', text: 'Not Sent' },
  request: { style: 'text-yellow-500', text: 'Request' },
  process: { style: 'text-sky-500', text: 'Process' },
  accepted: { style: 'text-green-500', text: 'accpeted' },
  rejected: { style: 'text-red-500', text: 'rejected' },
};

export default function Home({}) {
  const [dataUser, setDataUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { isOpen: isOpenGrade, onOpen: onOpenGrade, onOpenChange: onOpenChangeGrade } = useDisclosure();
  const { isOpen: isOpenGradeDelete, onOpen: onOpenGradeDelete, onOpenChange: onOpenChangeGradeDelete } = useDisclosure();
  const defaultValueGrade = { semester: null, cumulativeGpa: null };
  const [grades, setGrades] = useState([]);
  const [gradeForm, setGradeForm] = useState(defaultValueGrade);
  const [isEditGrade, setIsEditGrade] = useState(0);
  const [isLoadingGrade, setIsLoadingGrade] = useState(false);

  const { isOpen: isOpenAchievement, onOpen: onOpenAchievement, onOpenChange: onOpenChangeAchievement } = useDisclosure();
  const { isOpen: isOpenAchievementDelete, onOpen: onOpenAchievementDelete, onOpenChange: onOpenChangeAchievementDelete } = useDisclosure();
  const defaultValueAchievement = { achievement: '', description: '', year: '' };
  const [achievements, setAchievements] = useState([]);
  const [achievementForm, setAchievementForm] = useState(defaultValueAchievement);
  const [isEditAchievement, setIsEditAchievement] = useState(0);
  const [isLoadingAchievement, setIsLoadingAchievement] = useState(false);

  const getUser = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data },
      } = await axiosInstance.get('/api/student');

      setIsLoading(false);
      setDataUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveGrade = async () => {
    try {
      if (isEditGrade) {
        await axiosInstance.put(`/api/grade/${isEditGrade}`, gradeForm);
        setIsEditGrade(0);
      } else {
        await axiosInstance.post('/api/grade', gradeForm);
      }

      setGradeForm(defaultValueGrade);
      getGrades();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleDeleteGrade = async () => {
    try {
      await axiosInstance.delete(`/api/grade/${isEditGrade}`);
      setIsEditGrade(0);
      getGrades();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSaveAchievement = async () => {
    try {
      if (isEditAchievement) {
        await axiosInstance.put(`/api/achievement/${isEditAchievement}`, achievementForm);
        setIsEditAchievement(0);
      } else {
        await axiosInstance.post('/api/achievement', achievementForm);
      }

      setAchievementForm(defaultValueAchievement);
      getAchievements();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleDeleteAchievement = async () => {
    try {
      await axiosInstance.delete(`/api/achievement/${isEditAchievement}`);
      setIsEditAchievement(0);
      getAchievements();
    } catch (error) {
      console.error({ error });
    }
  };

  const getGrades = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get('/api/grade');

      getUser();
      setGrades(data);
    } catch (error) {
      console.error({ error });
    }
  };

  const getAchievements = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get('/api/achievement');
      setAchievements(data);
      console.log({ data });
    } catch (error) {
      console.error({ error });
    }
  };

  const handleRequest = async () => {
    try {
      await axiosInstance.post('/api/request');
      getUser();
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    getUser();
    getGrades();
    getAchievements();
  }, []);

  const formatFloat = (number) => {
    if (number > 1) {
      return number.toFixed(2);
    }
    return 0;
  };

  return (
    <StudentLayout className={'md:container md:mx-auto pb-10 space-y-4'} isLoading={isLoading}>
      <section id="status">
        <Card className="p-4 grid grid-cols-2">
          <div>
            <p>IPK :</p>
            <p className="font-semibold text-2xl md:text-3xl text-primary">{formatFloat(dataUser?.student?.gpa)}</p>
          </div>
          <div>
            <p>Status :</p>
            <p className={classNames('font-semibold text-xl ', requestList[dataUser?.student?.evaluationStatus || 'not_sent'].style)}>
              {requestList[dataUser?.student?.evaluationStatus || 'not_sent'].text}
            </p>

            {dataUser?.student?.evaluationStatus == 'not_sent' && (
              <Button color="primary" isDisabled={!dataUser?.ableToRequest} className="mt-4" onClick={handleRequest}>
                Kirim Request
              </Button>
            )}
            {!dataUser?.ableToRequest && <p className="text-gray-500">lengkapin serluruh data untuk kirim request!</p>}
          </div>
        </Card>
      </section>
      <section className="space-y-4" id="biodata">
        <p className="text-primary text-xl font-semibold">Biodata</p>
        <Card className="p-4 space-y-4">
          <table className="table-auto">
            <tbody>
              <tr>
                <td className="text-left">Nama depan</td>
                <td className="text-left pl-8">{dataUser?.student?.firstName || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Nama belakang</td>
                <td className="text-left pl-8">{dataUser?.student?.lastName || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Username</td>
                <td className="text-left pl-8">{dataUser?.username || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Email</td>
                <td className="text-left pl-8">{dataUser?.email || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">NIM</td>
                <td className="text-left pl-8">{dataUser?.student?.nim || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Tempat lahir</td>
                <td className="text-left pl-8">{dataUser?.student?.pob || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Tanggal lahir</td>
                <td className="text-left pl-8">{dataUser?.student?.dob ? dayjs(dataUser?.student?.dob).format('DD/MMM/YYYY') : '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Jenis kelamin</td>
                <td className="text-left pl-8">{dataUser?.student?.gender || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Alamat</td>
                <td className="text-left pl-8">{dataUser?.student?.address || '-'}</td>
              </tr>
              <tr>
                <p className="font-semibold mt-4 underline">Ayah</p>
              </tr>
              <tr>
                <td className="text-left">Nama</td>
                <td className="text-left pl-8">{dataUser?.student?.fatherName || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Pekerjaan</td>
                <td className="text-left pl-8">{dataUser?.student?.fatherJob || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Penghasilan</td>
                <td className="text-left pl-8">{dataUser?.student?.fatherIncome ? incomeParents.find(({ value }) => value == dataUser?.student?.fatherIncome).name : '-'}</td>
              </tr>
              <tr>
                <p className="font-semibold mt-4 underline ">Ibu</p>
              </tr>
              <tr>
                <td className="text-left">Nama</td>
                <td className="text-left pl-8">{dataUser?.student?.motherName || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Pekerjaan</td>
                <td className="text-left pl-8">{dataUser?.student?.motherJob || '-'}</td>
              </tr>
              <tr>
                <td className="text-left">Penghasilan</td>
                <td className="text-left pl-8">{dataUser?.student?.motherIncome ? incomeParents.find(({ value }) => value == dataUser?.student?.motherIncome).name : '='}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <div className="flex justify-end">
          <Link href={'/student/edit'}>
            <Button className="" color="primary">
              <FaEdit />
              Ubah biodata
            </Button>
          </Link>
        </div>
      </section>
      <section className="space-y-4" id="grades">
        <p className="text-primary text-xl font-semibold">Nilai</p>
        <Card className="p-4 space-y-4">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Semester</TableColumn>
              <TableColumn>IP</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody emptyContent={'No rows to display.'}>
              {grades.length !== 0 &&
                grades.map(({ semester, cumulativeGpa, id }, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{semester}</TableCell>
                    <TableCell>{cumulativeGpa}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        isIconOnly
                        color="warning"
                        variant="faded"
                        onClick={() => {
                          setGradeForm({ semester, cumulativeGpa });
                          setIsEditGrade(id);
                          onOpenGrade();
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="faded"
                        onClick={() => {
                          setIsEditGrade(id);
                          onOpenGradeDelete();
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex justify-end">
          <Button className="" color="primary" onClick={() => onOpenGrade()}>
            <IoMdAdd />
            Tambah nilai
          </Button>
        </div>
        <Modal isOpen={isOpenGrade} onOpenChange={onOpenChangeGrade}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{isEditGrade ? 'Edit nilai' : 'Tambah nilai'}</ModalHeader>
                <ModalBody>
                  <Input
                    label="Semester"
                    variant="bordered"
                    color="primary"
                    value={gradeForm.semester}
                    onChange={({ target: { value } }) => {
                      setGradeForm({ ...gradeForm, semester: value });
                    }}
                    type="number"
                  />
                  <Input
                    label="IP"
                    variant="bordered"
                    color="primary"
                    value={gradeForm.cumulativeGpa}
                    onChange={({ target: { value } }) => {
                      if (Number(value) >= 0 && Number(value) <= 4) {
                        setGradeForm({ ...gradeForm, cumulativeGpa: value });
                      }
                    }}
                    type="number"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setGradeForm(defaultValueGrade);
                      onClose();
                    }}
                  >
                    Tutup
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleSaveGrade();
                      onClose();
                    }}
                  >
                    Simpan
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenGradeDelete} onOpenChange={onOpenChangeGradeDelete}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Hapus nilai</ModalHeader>
                <ModalBody>
                  <p>Anda yakin ingi menghapus ini ?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setGradeForm(defaultValueGrade);
                      onClose();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleDeleteGrade();
                      onClose();
                    }}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
      <section className="space-y-4" id="achievements">
        <p className="text-primary text-xl font-semibold">Prestasi</p>
        <Card className="p-4 space-y-4">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Prestasi</TableColumn>
              <TableColumn>Tahun</TableColumn>
              <TableColumn>Deskripsi</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody emptyContent={'Tidak ada data '}>
              {achievements.length !== 0 &&
                achievements.map(({ achievement, year, description, id }, index) => (
                  <TableRow key={index + 1}>
                    <TableCell>{achievement}</TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        isIconOnly
                        color="warning"
                        variant="faded"
                        onClick={() => {
                          setAchievementForm({ achievement, year, description });
                          setIsEditAchievement(id);
                          onOpenAchievement();
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="faded"
                        onClick={() => {
                          setIsEditAchievement(id);
                          onOpenAchievementDelete();
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex justify-end">
          <Button className="" color="primary" onClick={() => onOpenAchievement()}>
            <IoMdAdd />
            Tambah achievement
          </Button>
        </div>
        <Modal isOpen={isOpenAchievement} onOpenChange={onOpenChangeAchievement}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{isEditAchievement ? 'Ubah Prestasi' : 'Tambah Prestasi'}</ModalHeader>
                <ModalBody>
                  <Input
                    label="Prestasi"
                    variant="bordered"
                    color="primary"
                    value={achievementForm.achievement}
                    onChange={({ target: { value } }) => {
                      setAchievementForm({ ...achievementForm, achievement: value });
                    }}
                    type="text"
                  />
                  <Input
                    label="Tahun"
                    variant="bordered"
                    color="primary"
                    value={achievementForm.year}
                    onChange={({ target: { value } }) => {
                      setAchievementForm({ ...achievementForm, year: value });
                    }}
                    type="text"
                  />
                  <Textarea
                    label="Deskripsi"
                    variant="bordered"
                    color="primary"
                    value={achievementForm.description}
                    onChange={({ target: { value } }) => {
                      setAchievementForm({ ...achievementForm, description: value });
                    }}
                    type="text"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setAchievementForm(defaultValueAchievement);
                      onClose();
                    }}
                  >
                    Tutup
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleSaveAchievement();
                      onClose();
                    }}
                  >
                    Simpan
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenAchievementDelete} onOpenChange={onOpenChangeAchievementDelete}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Delete Prestasi</ModalHeader>
                <ModalBody>
                  <p>Anda yakin ingin menghapus ini?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setAchievementForm(defaultValueAchievement);
                      onClose();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleDeleteAchievement();
                      onClose();
                    }}
                  >
                    Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
    </StudentLayout>
  );
}

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
