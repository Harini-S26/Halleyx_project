import React from 'react';
import Modal from '../common/Modal';
import OrderForm from './OrderForm';

export default function OrderModal({ open, onClose, order, onSubmit, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={order ? 'Edit Order' : 'Create New Order'} size="xl">
      <OrderForm initialData={order} onSubmit={onSubmit} onClose={onClose} loading={loading} />
    </Modal>
  );
}
