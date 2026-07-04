'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AdminServicesPage() {
  const categoriesList = [
    { name: 'Skills', slug: 'skills', count: 23 },
    { name: 'Bossing', slug: 'bossing', count: 35 },
    { name: 'Quests', slug: 'quests', count: 30 },
    { name: 'Minigames', slug: 'minigames', count: 20 },
  ];

  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setImages({
      skills: localStorage.getItem('cat_bg_skills') || '',
      bossing: localStorage.getItem('cat_bg_bossing') || '',
      quests: localStorage.getItem('cat_bg_quests') || '',
      minigames: localStorage.getItem('cat_bg_minigames') || '',
    });
  }, []);

  const handleImageUpload = (slug: string, url: string) => {
    localStorage.setItem(`cat_bg_${slug}`, url);
    setImages(prev => ({...prev, [slug]: url}));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-extrabold text-white">Services Catalog Config</h1>
          <p className="text-sm text-surface-300">CRUD configure skills, bosses, minigames, and quests settings.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Service</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categoriesList.map((cat) => (
          <GlassCard key={cat.slug} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-white text-lg">{cat.name}</span>
                <span className="text-xs text-surface-450 uppercase font-semibold">{cat.count} Active configurations</span>
              </div>
              <Button variant="secondary" size="sm" href={`/admin/services/${cat.slug}`}>
                Manage Configs
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-2 pt-4 border-t border-white/5">
              {images[cat.slug] ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img src={images[cat.slug]} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageUpload(cat.slug, '')}
                    className="absolute top-0.5 right-0.5 bg-red-500/80 text-white rounded p-0.5 hover:bg-red-500"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 shrink-0">
                  <ImageIcon size={18} />
                </div>
              )}
              <div className="flex flex-col gap-1 w-full">
                <span className="text-xs font-semibold text-surface-400">Card Background</span>
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs border border-white/10 transition-colors text-center">
                  Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          handleImageUpload(cat.slug, e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
