import { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "../../../components/tables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DownloadIcon,
  ExclamationTriangle,
} from "../../../components/icons";
import CircularButton from "../../../components/ui/button/CircularButton";
import { Popup, ConfirmationPopup } from "../../../components/ui/popup";
import { useModal } from "../../../hooks/useModal";

import { InventoryItem } from "../Inventory";
import SearchBox from "../../../components/form/input/SearchBox";
import Button from "../../../components/ui/button/Button";
import ComponentCard from "../../../components/common/ComponentCard";
import AddProductPopup from "./AddProductPopup";

interface InventoryTableProps {
  data: InventoryItem[];
  onDelete: (ids: number[]) => void;
  onAdd: (product: Omit<InventoryItem, "id" | "status">) => void;
  onUpdate: (product: InventoryItem) => void;
}

const InventoryTable = ({ data, onDelete, onAdd, onUpdate }: InventoryTableProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Selection state
  const [selectedRows, setSelectedRows] = useState<InventoryItem[]>([]);

  // Add/Edit Product State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  // Delete Confirmation State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const handleEditClick = (item: InventoryItem) => {
    setEditingProduct(item);
    setIsAddProductOpen(true);
  };

  const handleVehicleBadgeClick = (item: InventoryItem) => {
    setSelectedVehicles(item.vehicles);
    setSelectedItemName(item.name);
    openModal();
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete([itemToDelete.id]);
    }
    setIsDeleteOpen(false);
    setItemToDelete(null);
  };

  const handleBulkDeleteClick = () => {
    setIsBulkDeleteOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    onDelete(selectedRows.map(r => r.id));
    setIsBulkDeleteOpen(false);
    setSelectedRows([]);
  };

  const currentFilteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleExport = () => {
    // Priority: selected rows > filtered data
    const dataToExport = selectedRows.length > 0 ? selectedRows : currentFilteredData;

    // Transform data for Excel
    const exportData = dataToExport.map(item => ({
      "ID": item.id,
      "Product Name": item.name,
      "Category": item.category,
      "Brand/Supplier": item.brand,
      "Quantity": item.quantity,
      "Price": `$${item.price.toFixed(2)}`,
      "Status": getStockStatus(item.quantity),
      "Assigned Vehicles": item.vehicles.join(", ")
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const exportPrefix = selectedRows.length > 0 ? "selected" : "filtered";
    const filename = `inventory_${exportPrefix}_${date}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  const renderIdName = (item: InventoryItem) => (
    <div>
      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
        {item.name}
      </span>
    </div>
  );

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
  };

  const renderStatus = (item: InventoryItem) => {
    const status = getStockStatus(item.quantity);
    return (
      <Badge
        size="sm"
        color={
          status === "In Stock"
            ? "success"
            : status === "Low Stock"
              ? "warning"
              : "error"
        }
      >
        {status}
      </Badge>
    );
  };

  const renderVehicles = (item: InventoryItem) => (
    <div
      onClick={() => handleVehicleBadgeClick(item)}
      className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
    >
      <Badge
        size="sm"
        color="primary"
      >
        {item.vehicles.length}
      </Badge>
    </div>
  );

  const renderActions = (item: InventoryItem) => (
    <div className="flex gap-2">
      <CircularButton
        variant="outline"
        size="md"
        onClick={() => handleEditClick(item)}
      >
        <PencilIcon size={16} />
      </CircularButton>
      <CircularButton
        variant="outline"
        size="md"
        onClick={() => handleDeleteClick(item)}
      >
        <TrashIcon size={16} />
      </CircularButton>
    </div>
  );

  return (
    <>
      <ComponentCard>
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchBox
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {selectedRows.length > 0 && (
              <Button
                variant="danger"
                startIcon={<TrashIcon size={18} />}
                onClick={handleBulkDeleteClick}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            )}
            <Button
              variant="outline"
              startIcon={<DownloadIcon size={18} />}
              onClick={handleExport}
              disabled={currentFilteredData.length === 0}
            >
              Export {selectedRows.length > 0 ? `(${selectedRows.length})` : ""}
            </Button>
            <Button
              variant="primary"
              startIcon={<PlusIcon size={18} />}
              onClick={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
            >
              Add Product
            </Button>
          </div>
        </div>

        <DataTable
          name="inventoryTable"
          colInfos={[
            { key: true, dataProp: 'id', visible: false },
            { checkboxButton: { text: "", icon: '', color: 'blue', onClick: () => { } } },
            { title: 'ID / Name', dataProp: 'name', sort: 'asc', getCellData: renderIdName },
            { title: 'Category', dataProp: 'category' },
            { title: 'Brand/Supplier', dataProp: 'brand' },
            { title: 'Quantity', dataProp: 'quantity' },
            { title: 'Price', dataProp: 'price', getCellData: (item) => `₹${item.price.toFixed(2)}` },
            { title: 'Status', dataProp: 'status', getCellData: renderStatus },
            { title: 'Vehicles', dataProp: 'vehicles', getCellData: renderVehicles },
            { title: 'Actions', getCellData: renderActions },
          ]}
          tableData={currentFilteredData}
          pageSize={10}
          onSelectedRowsChange={setSelectedRows}
        />
      </ComponentCard>

      <Popup
        isOpen={isOpen}
        onClose={closeModal}
        title="Assigned Vehicles"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Vehicles using: <span className="font-medium">{selectedItemName}</span>
        </p>
        <div className="space-y-2 mt-4">
          {selectedVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {vehicle}
              </p>
            </div>
          ))}
        </div>
      </Popup>

      <ConfirmationPopup
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone and will remove the item from inventory.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        icon={<ExclamationTriangle className="text-error-500" size={32} />}
      />

      <ConfirmationPopup
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Products"
        message={`Are you sure you want to delete ${selectedRows.length} selected products? This action cannot be undone and will remove these items from inventory.`}
        confirmLabel="Delete All"
        confirmVariant="danger"
        icon={<ExclamationTriangle className="text-error-500" size={32} />}
      />

      <AddProductPopup
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onAdd={onAdd}
        onUpdate={onUpdate}
        initialData={editingProduct || undefined}
      />
    </>
  );
};

export default InventoryTable;