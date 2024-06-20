import { Button } from '@nextui-org/react';
import { saveAs } from 'file-saver';
import XLSX from 'sheetjs-style';
import { SiMicrosoftexcel } from 'react-icons/si';

const ExcelExport = ({ data, fileName = 'detail', ...etc }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button onClick={exportToExcel} {...etc}>
      <SiMicrosoftexcel />
    </Button>
  );
};

export default ExcelExport;
