import AdminLayout from '@/components/layouts/AdminLayout';
import axiosInstance from '@/utils/axiosInstance';
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from '@nextui-org/react';
import classNames from 'classnames';
import { parse } from 'cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const Criteria = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [dataCriteria, setDataCriteria] = useState([]);
  const { isOpen: isOpenCriteria, onOpen: onOpenCriteria, onOpenChange: onOpenChangeCriteria } = useDisclosure();
  const { isOpen: isOpenCriteriaDelete, onOpen: onOpenCriteriaDelete, onOpenChange: onOpenChangeCriteriaDelete } = useDisclosure();

  const defaultCriteriaForm = {
    name: '',
    maxValue: '',
    weightValue: '',
  };
  const [criteriaForm, setCriteriaForm] = useState(defaultCriteriaForm);
  const [isEditCriteria, setIsEditCriteria] = useState(null);

  const [dataWeightValue, setDataWeightValue] = useState({
    total: 0,
    remaining: 0,
  });

  const getData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data },
      } = await axiosInstance.get('/api/admin/criteria');

      setDataCriteria(data);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCriteria = async () => {
    try {
      if (isEditCriteria !== null) {
        await axiosInstance.put(`/api/admin/criteria/${isEditCriteria}`, criteriaForm);
        setIsEditCriteria(null);
      } else {
        await axiosInstance.post('/api/admin/criteria', criteriaForm);
        setCriteriaForm(defaultCriteriaForm);
      }
      setCriteriaForm(defaultCriteriaForm);
      getData();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleDeleteCriteria = async () => {
    try {
      await axiosInstance.delete(`/api/admin/criteria/${isEditCriteria}`);
      setIsEditCriteria(null);
      getData();
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    getData(dataCriteria);
  }, []);

  useEffect(() => {
    countWeightValue(dataCriteria);
  }, [dataCriteria]);

  const countWeightValue = (data) => {
    let totalCount = 0;
    if (data.length != 0) {
      totalCount = data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.weightValue;
      }, 0);
    }

    setDataWeightValue({
      total: totalCount,
      remaining: 100 - totalCount,
    });
  };

  return (
    <AdminLayout title={'Kriteria'}>
      <Card className="p-4">
        <div className="mb-4 flex justify-between">
          <div className="text-sm flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <p>Total bobot nilai :</p>
              <p className={classNames(dataWeightValue.total == 100 ? 'text-green-500' : 'text-red-500')}>{dataWeightValue.total} %</p>
            </div>
            {dataWeightValue.remaining !== 0 && (
              <div className="flex items-center gap-2 text-red-500">
                <p>Bobot nilai yang kurang :</p>
                <p>{dataWeightValue.remaining} %</p>
              </div>
            )}
          </div>
          <Button
            className="w-fit"
            color="primary"
            onClick={() => {
              setCriteriaForm(defaultCriteriaForm);
              onOpenCriteria();
            }}
          >
            <FaPlus />
            Tambah Kriteria
          </Button>
        </div>
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Maksimal Nilai</TableColumn>
            <TableColumn className="text-right">Bobot Nilai</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody emptyContent="There is no data">
            {dataCriteria.length !== 0 &&
              dataCriteria.map(({ id, name, weightValue, maxValue }, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{maxValue}</TableCell>
                  <TableCell className="text-right">{weightValue} %</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      isIconOnly
                      variant="faded"
                      color="warning"
                      onClick={() => {
                        setCriteriaForm({ name, weightValue, maxValue });
                        setIsEditCriteria(id);
                        onOpenCriteria();
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      isIconOnly
                      variant="faded"
                      color="danger"
                      onClick={() => {
                        setIsEditCriteria(id);
                        onOpenCriteriaDelete();
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Modal isOpen={isOpenCriteria} onOpenChange={onOpenChangeCriteria}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{isEditCriteria ? 'Ubah Kriteria' : 'Tambah Kriteria'}</ModalHeader>
                <ModalBody>
                  <Input
                    label="Nama"
                    variant="bordered"
                    color="primary"
                    value={criteriaForm.name}
                    onChange={({ target: { value } }) => {
                      setCriteriaForm({ ...criteriaForm, name: value });
                    }}
                    type="text"
                  />
                  <Input
                    label="Maksimal Nilai"
                    variant="bordered"
                    color="primary"
                    value={criteriaForm.maxValue}
                    onChange={({ target: { value } }) => {
                      setCriteriaForm({ ...criteriaForm, maxValue: value });
                    }}
                    type="number"
                  />
                  <Input
                    label="Bobot nilai"
                    variant="bordered"
                    color="primary"
                    value={criteriaForm.weightValue}
                    onChange={({ target: { value } }) => {
                      setCriteriaForm({ ...criteriaForm, weightValue: value });
                    }}
                    type="number"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setCriteriaForm(defaultCriteriaForm);
                      onClose();
                    }}
                  >
                    Tutup
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleSaveCriteria();
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
        <Modal isOpen={isOpenCriteriaDelete} onOpenChange={onOpenChangeCriteriaDelete}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Hapus kriteria</ModalHeader>
                <ModalBody>
                  <p>Anda yakin ingin menghapus kriteria ini ?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleDeleteCriteria();
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

export default Criteria;
