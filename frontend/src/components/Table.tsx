import React, { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | null;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const Table = <T extends object>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="p-4 text-left font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-gray-100 cursor-pointer`}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-4 border-t border-gray-200">
                    {column.accessor ? (
                      (row[column.accessor] as ReactNode)
                    ) : (
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
