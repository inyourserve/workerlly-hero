interface DataTableProps {
    columns: { key: string; label: string }[];
    data: any[];
  }
  
  const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
    return (
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border border-gray-300 px-4 py-2">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key} className="border border-gray-300 px-4 py-2">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default DataTable;
  