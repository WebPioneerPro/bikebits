import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import TablePagination from './TablePagination';
import EmptyState from './EmptyState';
import PackageSearchIcon from '../icons/PackageSearchIcon';
import Checkbox from '../form/input/Checkbox';

interface ColInfo {
  key?: boolean;
  dataProp?: string;
  visible?: boolean;
  dataType?: string;
  checkboxButton?: {
    text: string;
    icon: string;
    color: string;
    onClick: () => void;
  };
  title?: string;
  sort?: 'asc' | 'desc';
  textOverflowEllipsis?: boolean;
  tooltip?: boolean;
  getCellData?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  name: string;
  colInfos: ColInfo[];
  tableData: any[];
  pageSize: number;
  onSelectedRowsChange?: (selectedRows: any[]) => void;
  allowColumnResize?: boolean;
}

const DataTable = ({
  colInfos,
  tableData,
  pageSize,
  onSelectedRowsChange,
  allowColumnResize = true
}: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const keyColumn = colInfos.find(col => col.key);
  const visibleColumns = colInfos.filter(col => col.visible !== false);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return tableData;

    return [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tableData, sortConfig]);

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(tableData.length / pageSize);

  const handleSort = (dataProp: string) => {
    const direction = sortConfig?.key === dataProp && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: dataProp, direction });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...paginatedData]);
    }
  };

  const handleRowSelect = (row: any) => {
    const isSelected = selectedRows.some(selected =>
      keyColumn ? selected[keyColumn.dataProp!] === row[keyColumn.dataProp!] : selected === row
    );

    if (isSelected) {
      setSelectedRows(selectedRows.filter(selected =>
        keyColumn ? selected[keyColumn.dataProp!] !== row[keyColumn.dataProp!] : selected !== row
      ));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  useEffect(() => {
    onSelectedRowsChange?.(selectedRows);
  }, [selectedRows, onSelectedRowsChange]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleResizeStart = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(index);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing === null) return;

      const headerCell = tableRef.current?.querySelectorAll('th')[isResizing];
      if (!headerCell) return;

      const rect = headerCell.getBoundingClientRect();
      const newWidth = Math.max(50, e.clientX - rect.left);

      setColumnWidths((prev) => ({
        ...prev,
        [isResizing]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const renderCell = (col: ColInfo, item: any) => {
    if (col.getCellData) {
      return col.getCellData(item);
    }

    if (col.dataProp) {
      const value = item[col.dataProp];
      return (
        <span
          className={col.textOverflowEllipsis ? 'truncate' : ''}
          title={col.tooltip ? value : undefined}
        >
          {value}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6" ref={tableRef}>
      <div className="max-w-full overflow-x-auto">
        <Table className={allowColumnResize ? "table-fixed" : ""}>
          <TableHeader className="px-6 py-3.5 border-t border-gray-100 border-y bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
            <TableRow>
              {visibleColumns.map((col, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="relative px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 group overflow-hidden"
                  style={columnWidths[index] ? { width: `${columnWidths[index]}px`, minWidth: `${columnWidths[index]}px` } : {}}
                >
                  {col.checkboxButton ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                      />
                      <button
                        onClick={col.checkboxButton.onClick}
                        className={`text-${col.checkboxButton.color}-600 hover:text-${col.checkboxButton.color}-700`}
                      >
                        <i className={`fa ${col.checkboxButton.icon}`}></i>
                        {col.checkboxButton.text}
                      </button>
                    </div>
                  ) : col.title ? (
                    <div
                      className={col.sort ? 'cursor-pointer select-none pr-4' : 'pr-4'}
                      onClick={col.sort && col.dataProp ? () => handleSort(col.dataProp!) : undefined}
                    >
                      {col.title}
                      {col.sort && sortConfig?.key === col.dataProp && (
                        <span className="ml-1">
                          {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  ) : null}

                  {allowColumnResize && (
                    <div
                      className={`absolute top-0 right-0 h-full w-1 cursor-col-resize transition-all hover:w-1.5 hover:bg-brand-500/30 ${isResizing === index ? 'bg-brand-500 w-1.5' : 'bg-transparent'
                        }`}
                      onMouseDown={(e) => handleResizeStart(index, e)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="p-0">
                  <EmptyState icon={PackageSearchIcon} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={keyColumn ? item[keyColumn.dataProp!] : rowIndex}>
                  {visibleColumns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="px-3 py-4 text-start truncate"
                      style={columnWidths[colIndex] ? { width: `${columnWidths[colIndex]}px`, minWidth: `${columnWidths[colIndex]}px` } : {}}
                    >
                      {col.checkboxButton ? (
                        <Checkbox
                          checked={selectedRows.some(selected =>
                            keyColumn ? selected[keyColumn.dataProp!] === item[keyColumn.dataProp!] : selected === item
                          )}
                          onChange={() => handleRowSelect(item)}
                        />
                      ) : (
                        <div className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {renderCell(col, item)}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={tableData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DataTable;