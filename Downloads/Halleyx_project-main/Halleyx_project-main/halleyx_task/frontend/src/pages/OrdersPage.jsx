import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrders } from '../hooks/useOrders';
import { useDashboard } from '../context/DashboardContext';
import { useDebounce } from '../hooks/useDebounce';
import OrderTable from '../components/orders/OrderTable';
import OrderModal from '../components/orders/OrderModal';
import OrderFilters from '../components/orders/OrderFilters';
import EmptyState from '../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const { dateFilter }   = useDashboard();
  const { orders, loading, createOrder, updateOrder, deleteOrder } = useOrders(dateFilter);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [editOrder, setEditOrder]     = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const debouncedSearch               = useDebounce(search, 250);

  const filtered = orders.filter(o => {
    const matchSearch = debouncedSearch
      ? `${o.firstName} ${o.lastName} ${o.email} ${o.product}`.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true;
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleOpen  = (order = null) => { setEditOrder(order); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditOrder(null); };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editOrder) {
        await updateOrder(editOrder._id, formData);
        toast.success('Order updated successfully');
      } else {
        await createOrder(formData);
        toast.success('Order created successfully');
      }
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save order');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted');
    } catch { toast.error('Failed to delete order'); }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Customer Orders</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => handleOpen()} className="btn-primary">
          <Plus size={15} /> Create Order
        </button>
      </div>

      {/* Filters */}
      <OrderFilters
        search={search} onSearch={setSearch}
        statusFilter={statusFilter} onStatusFilter={setStatusFilter}
      />

      {/* Table or empty */}
      {!loading && orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Create your first order to start tracking customer data and generating insights."
          action={<button onClick={() => handleOpen()} className="btn-primary"><Plus size={15} /> Create First Order</button>}
        />
      ) : (
        <OrderTable orders={filtered} loading={loading} onEdit={handleOpen} onDelete={handleDelete} />
      )}

      {/* Modal */}
      <OrderModal open={showModal} onClose={handleClose} order={editOrder} onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}
