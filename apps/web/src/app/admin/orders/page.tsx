'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { formatPriceFromDollars, getStatusColor } from '../../../lib/utils';

interface OrderItem {
  id: string;
  user: string;
  name: string;
  price: number;
  status: string;
  date: string;
  staff: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ord_1', user: 'Al***x', name: '70-99 Strength Training', price: 129.99, status: 'IN_PROGRESS', date: 'June 30, 2026', staff: 'Booster_Steve' },
    { id: 'ord_2', user: 'Ki***g', name: 'Fire Cape Service', price: 15.0, status: 'COMPLETED', date: 'June 18, 2026', staff: 'Booster_Dave' },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editStaff, setEditStaff] = useState('');

  const handleEditClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditStaff(order.staff);
    setModalOpen(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id
          ? { ...ord, status: editStatus, staff: editStaff }
          : ord
      )
    );
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Order Audits Logs</h1>
        <p className="text-sm text-surface-300">View complete order lifecycles and assign staff boosters.</p>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((ord) => (
          <GlassCard key={ord.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-lg">{ord.name}</span>
                <Badge variant={ord.status === 'COMPLETED' ? 'success' : ord.status === 'IN_PROGRESS' ? 'info' : 'warning'} size="sm">
                  {ord.status}
                </Badge>
              </div>
              <span className="text-xs text-surface-450">
                Order ID: {ord.id} • Buyer: {ord.user} • Booster: {ord.staff || 'Unassigned'} • Date: {ord.date}
              </span>
            </div>

            <div className="flex items-center gap-6 self-end sm:self-auto">
              <span className="text-lg font-display font-extrabold text-gold-400">
                {formatPriceFromDollars(ord.price)}
              </span>
              <Button onClick={() => handleEditClick(ord)} variant="secondary" size="sm">
                Edit Order
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Edit Order Modal */}
      {selectedOrder && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Edit Order: ${selectedOrder.id}`}>
          <form onSubmit={handleSaveOrder} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Order Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="glass-input px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="PAUSED">PAUSED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            <Input
              label="Assigned Booster"
              value={editStaff}
              onChange={(e) => setEditStaff(e.target.value)}
              placeholder="e.g. Booster_Steve"
            />

            <Button type="submit" variant="primary" className="w-full mt-2">
              Save Order Changes
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
