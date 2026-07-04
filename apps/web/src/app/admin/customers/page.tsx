'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: 'usr_1', name: 'Al***x', email: 'alex@example.com', role: 'CUSTOMER', date: 'June 20, 2026' },
    { id: 'usr_2', name: 'Booster_Steve', email: 'steve@guardianrs.com', role: 'STAFF', date: 'May 10, 2026' },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState('');

  const handleEditClick = (user: UserItem) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((usr) =>
        usr.id === selectedUser.id ? { ...usr, role: editRole } : usr
      )
    );
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">User Accounts Database</h1>
        <p className="text-sm text-surface-300">View user registration metrics and update account roles authorization.</p>
      </div>

      <div className="flex flex-col gap-4">
        {users.map((usr) => (
          <GlassCard key={usr.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-base">{usr.name}</span>
                <Badge variant={usr.role === 'STAFF' ? 'info' : usr.role === 'ADMIN' ? 'danger' : 'default'} size="sm">
                  {usr.role}
                </Badge>
              </div>
              <span className="text-xs text-surface-450">
                User ID: {usr.id} • Email: {usr.email} • Registered: {usr.date}
              </span>
            </div>

            <Button onClick={() => handleEditClick(usr)} variant="secondary" size="sm" className="self-end sm:self-auto">
              Edit Account Role
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Edit Role Modal */}
      {selectedUser && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Change Role: ${selectedUser.name}`}>
          <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Account Authorization Level</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="glass-input px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="STAFF">STAFF (BOOSTER)</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full mt-2">
              Save Role Authorization
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
