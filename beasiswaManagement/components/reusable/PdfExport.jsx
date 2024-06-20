import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { usePDF } from 'react-to-pdf';
import { BiSolidFilePdf } from 'react-icons/bi';
import { useEffect, useState } from 'react';

const PdfExport = ({ data, fileName = 'result', ...others }) => {
  const { toPDF, targetRef } = usePDF({ filename: `${fileName}.pdf` });

  return (
    <div>
      <div className="">
        <Button isIconOnly onClick={() => toPDF()} {...others}>
          <BiSolidFilePdf />
        </Button>
      </div>
      <div className="" style={{ position: 'absolute', top: -9999, left: -9999 }}>
        <div ref={targetRef}>
          {data.length !== 0 && (
            <Table aria-label="Example static collection table">
              <TableHeader>
                {Object.entries(data[0]).map(([key, value]) => (
                  <TableColumn key={key}>{key}</TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index + 1}>
                    {Object.entries(item).map(([key, value]) => (
                      <TableCell key={key + 'item'}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
                =
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <style jsx>{`
        .pdf-hidden {
          position: 'absolute', top: -9999, left: -9999
        }
      `}</style>
    </div>
  );
};

export default PdfExport;
