import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit2, Check, Link, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Webhook } from '../types';
import toast from 'react-hot-toast';

export function WebhookManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Webhook>>({
    name: '',
    url: '',
    imageUrl: '',
  });

  const { webhooks, addWebhook, updateWebhook, deleteWebhook, setSelectedWebhook, selectedWebhookId } = useStore();

  const validateWebhookUrl = (url: string) => {
    const discordWebhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/.+$/;
    return discordWebhookRegex.test(url);
  };

  // Handler for file input changes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast.error('Name and URL are required');
      return;
    }

    if (!validateWebhookUrl(formData.url)) {
      toast.error('Invalid Discord webhook URL');
      return;
    }

    if (editingId) {
      updateWebhook(editingId, formData);
      setEditingId(null);
      toast.success('Webhook updated successfully');
    } else {
      addWebhook(formData as Omit<Webhook, 'id'>);
      toast.success('Webhook added successfully');
    }

    setFormData({ name: '', url: '', imageUrl: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-400">Webhook Management</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Add Webhook
          </button>
        )}
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12 text-lg rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., OSINT Updates"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">
              Webhook URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full h-12 text-lg pl-10 rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">
              Image URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full h-12 text-lg pl-10 rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          {/* Upload Image Functionality */}
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-white file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check size={20} />
              {editingId ? 'Update' : 'Add'} Webhook
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', url: '', imageUrl: '' });
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Webhook List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className={`relative group p-4 rounded-lg border transition-all duration-200 ${
              selectedWebhookId === webhook.id 
                ? 'bg-blue-600/10 border-blue-500' 
                : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              {webhook.imageUrl ? (
                <img
                  src={webhook.imageUrl}
                  alt={webhook.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Link className="text-blue-400" size={24} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{webhook.name}</h3>
                <p className="text-sm text-gray-400 truncate max-w-[200px]">{webhook.url}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedWebhook(webhook.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedWebhookId === webhook.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-blue-600/20 hover:text-blue-400'
                }`}
              >
                {selectedWebhookId === webhook.id ? 'Selected' : 'Select'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(webhook.id);
                    setFormData(webhook);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Edit webhook"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    deleteWebhook(webhook.id);
                    toast.success('Webhook deleted successfully');
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete webhook"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {webhooks.length === 0 && !isAdding && (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
          <Link className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-400">No webhooks added yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Webhook
          </button>
        </div>
      )}
    </div>
  );
}
