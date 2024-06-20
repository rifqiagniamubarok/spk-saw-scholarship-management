import { useState } from 'react';
import { Button, Card, DatePicker, Input, Radio, RadioGroup, Textarea } from '@nextui-org/react';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { now, parseAbsoluteToLocal } from '@internationalized/date';

const Create = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nim: '',
    pob: '',
    dob: null,
    gender: '',
    address: '',
    father_name: '',
    father_job: '',
    father_income: '',
    mother_name: '',
    mother_job: '',
    mother_income: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: `${date.year}-${date.month}-${date.day}`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/student', formData);
      console.log('Student created successfully:', res.data);
      // Redirect or show success message
    } catch (error) {
      console.error('An error occurred:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-white">
      <div className="container mx-auto pt-8">
        <form onSubmit={handleSubmit}>
          <Card className="p-4 grid grid-cols-6 gap-4 ">
            <div className="col-span-6 mb-4">
              <p className="text-3xl">Create</p>
            </div>
            <Input
              className="col-span-2"
              label="First name"
              variant="bordered"
              color="primary"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Last name"
              variant="bordered"
              color="primary"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <Input className="col-span-2" label="NIM" variant="bordered" color="primary" type="number" name="nim" value={formData.nim} onChange={handleChange} required />
            <Input className="col-span-3" label="Place of Birth" variant="bordered" color="primary" type="text" name="pob" value={formData.pob} onChange={handleChange} required />
            <DatePicker className="col-span-3" label="Date of Birth" variant="bordered" color="primary" onChange={handleDateChange} required />
            <div className="col-span-2">
              <RadioGroup label="Select your gender" color="primary" name="gender" value={formData.gender} onChange={handleChange} required>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </RadioGroup>
            </div>
            <Textarea
              className="col-span-4"
              label="Address"
              variant="bordered"
              color="primary"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Father's name"
              variant="bordered"
              color="primary"
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Father's job"
              variant="bordered"
              color="primary"
              type="text"
              name="father_job"
              value={formData.father_job}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Father's income"
              variant="bordered"
              color="primary"
              type="number"
              name="father_income"
              value={formData.father_income}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Mother's name"
              variant="bordered"
              color="primary"
              type="text"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Mother's job"
              variant="bordered"
              color="primary"
              type="text"
              name="mother_job"
              value={formData.mother_job}
              onChange={handleChange}
              required
            />
            <Input
              className="col-span-2"
              label="Mother's income"
              variant="bordered"
              color="primary"
              type="number"
              name="mother_income"
              value={formData.mother_income}
              onChange={handleChange}
              required
            />
            <Button className="col-span-6" type="submit" color="primary">
              Save
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Create;
