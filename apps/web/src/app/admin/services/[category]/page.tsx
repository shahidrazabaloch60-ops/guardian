'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2, Save, Trash2, Plus, Search } from 'lucide-react';
import GlassCard from '../../../../components/ui/GlassCard';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Badge from '../../../../components/ui/Badge';

// Import all data sources
import { bosses } from '../../../../data/bosses';
import { skills } from '../../../../data/skills';
import { quests } from '../../../../data/quests';
import { minigames } from '../../../../data/minigames';

export default function CategoryAdminPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    // Load initial data based on category
    let initialData: any[] = [];
    if (category === 'bossing') initialData = bosses;
    if (category === 'skills') initialData = skills;
    if (category === 'quests') initialData = quests;
    if (category === 'minigames') initialData = minigames;
    
    setItems(initialData);
  }, [category]);

  const handleEdit = (item: any) => {
    setEditingId(item.slug);
    setEditForm({ ...item });
  };

  const handleSave = () => {
    setItems(items.map(i => i.slug === editingId ? editForm : i));
    setEditingId(null);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this service config?')) {
      setItems(items.filter(i => i.slug !== slug));
    }
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="text-surface-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-extrabold text-white capitalize">{category} Configuration</h1>
          <p className="text-sm text-surface-300">Manage base prices, descriptions, and settings for {category}.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
        <div className="w-full sm:max-w-md">
          <Input 
            placeholder="Search services..." 
            icon={Search} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!py-2"
          />
        </div>
        <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto">
          <Plus size={16} /> Add New Service
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredItems.map(item => (
          <GlassCard key={item.slug} hover={false} className="border border-white/5 bg-white/[0.01] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {editingId === item.slug ? (
              // EDIT MODE
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input 
                    label="Name" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  />
                  <Input 
                    label="Base Price ($)" 
                    type="number"
                    value={editForm.price || editForm.basePrice || 0} 
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      if (category === 'skills') setEditForm({...editForm, basePrice: val});
                      else setEditForm({...editForm, price: val, pricePerKc: val, pricePerHour: val});
                    }} 
                  />
                  {category === 'bossing' && (
                    <Input 
                      label="Difficulty" 
                      value={editForm.difficulty || ''} 
                      onChange={e => setEditForm({...editForm, difficulty: e.target.value})} 
                    />
                  )}
                  {category === 'skills' && (
                    <Input 
                      label="Category" 
                      value={editForm.category || ''} 
                      onChange={e => setEditForm({...editForm, category: e.target.value})} 
                    />
                  )}
                  <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-4">
                    <label className="text-xs font-semibold text-surface-400">Background Image</label>
                    <div className="flex items-center gap-4">
                      {editForm.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditForm({ ...editForm, image: '' })}
                            className="absolute top-1 right-1 bg-red-500/80 text-white rounded p-0.5 hover:bg-red-500"
                            title="Remove Image"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                      <Input 
                        placeholder="Image URL or upload file..." 
                        value={editForm.image || ''} 
                        onChange={e => setEditForm({...editForm, image: e.target.value})} 
                        className="w-full"
                      />
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm border border-white/10 transition-colors shrink-0">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setEditForm({ ...editForm, image: e.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} className="flex items-center gap-2">
                    <Save size={14} /> Save
                  </Button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon || '⚙️'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-base">{item.name}</span>
                    <span className="text-xs text-surface-400 line-clamp-1">{item.description}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-surface-450 tracking-wider">Price Base</span>
                    <span className="text-gold-400 font-bold">
                      ${(item.price || item.basePrice || item.pricePerKc || item.pricePerHour || 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400 text-surface-300 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.slug)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-surface-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
            
          </GlassCard>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-surface-400">No services found.</div>
        )}
      </div>
    </div>
  );
}
