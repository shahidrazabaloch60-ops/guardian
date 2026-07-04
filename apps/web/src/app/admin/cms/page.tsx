'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

interface CMSPageItem {
  title: string;
  slug: string;
  status: string;
  editor: string;
}

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CMSPageItem[]>([
    { title: 'About Us page details', slug: 'about', status: 'PUBLISHED', editor: 'Admin_Steve' },
    { title: 'Terms of Service', slug: 'terms', status: 'PUBLISHED', editor: 'Admin_Steve' },
    { title: 'Privacy Policies', slug: 'privacy', status: 'PUBLISHED', editor: 'Admin_Steve' },
  ]);

  const [selectedPage, setSelectedPage] = useState<CMSPageItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const handleEditClick = (page: CMSPageItem) => {
    setSelectedPage(page);
    setEditTitle(page.title);
    setEditStatus(page.status);
    setModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    setPages((prev) =>
      prev.map((p) =>
        p.slug === selectedPage.slug
          ? { ...p, title: editTitle, status: editStatus }
          : p
      )
    );
    setModalOpen(false);
    setSelectedPage(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">CMS Content Editor</h1>
        <p className="text-sm text-surface-300">Edit content for static landing pages, blog entries, and SEO tags.</p>
      </div>

      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <GlassCard key={page.slug} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-lg">{page.title}</span>
              <span className="text-xs text-surface-450">Route: /{page.slug} • Last updated by: {page.editor}</span>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <Badge variant={page.status === 'PUBLISHED' ? 'success' : 'default'}>{page.status}</Badge>
              <Button onClick={() => handleEditClick(page)} variant="secondary" size="sm">
                Edit Page
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Edit Page Modal */}
      {selectedPage && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Edit Page Content: /${selectedPage.slug}`}>
          <form onSubmit={handleSavePage} className="flex flex-col gap-4">
            <Input
              label="Page Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Publishing Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="glass-input px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full mt-2">
              Save CMS Changes
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
