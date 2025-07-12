import React from 'react';

type columns = {
  type: 'text' | 'button' | 'link' | 'icon';
  columnName: string;
  rowKey: string;
  onclick?: () => void;
  rowName?: string;
  Icon?: React.ComponentType<any>;
}

type TableProps = {
  data: Array<Record<string, any>>;
  columns: columns[];
};

const TableView: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto rounded shadow-md">
      <table className="min-w-full bg-[#edf0f6] text-sm text-center text-gray-700">
        <thead className="bg-[#e0e6f2] text-gray-800 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col.columnName} className="px-6 py-3">
                {col.columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#e0e6f2]">
              {columns.map((col) => {
                if (col.type === 'text') {
                  return <td key={col.rowKey} className="px-6 py-4">
                    {row[col.rowKey]}
                  </td>
                }
                else if (col.type === 'button') {
                  return <td key={col.rowKey} className="px-6 py-4">
                    {row[col.rowKey]}
                  </td>
                }
                else if (col.type === 'link') {
                  return <td onClick={col.onclick} key={col.rowKey} className="px-6 py-4 underline text-blue-500 hover:text-blue-700">
                    <span className='cursor-pointer '>{col.rowName}</span>
                  </td>
                }
                else if (col.type === 'icon') {
                  return <td key={col.rowKey} className="px-6 py-4 items-center justify-center flex">
                    {<col.Icon />}
                  </td>
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
