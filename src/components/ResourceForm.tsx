import React, { useState } from 'react';
import { X, Plus, Link, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Resource } from '../types';
import toast from 'react-hot-toast';

export function ResourceForm({ onSubmit }: { 
  onSubmit: (resource: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const selectedWebhookId = useStore((state) => state.selectedWebhookId);
  const webhooks = useStore((state) => state.webhooks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWebhookId) {
      toast.error('Please select a webhook first');
      return;
    }
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!webhook) {
      toast.error('Selected webhook not found');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        webhookUrl: webhook.url,
        tags: formData.tags,
      });
      // Remove duplicate toast here (make sure only one toast is triggered)
      // toast.success('Resource shared successfully!');
      setFormData({ title: '', description: '', url: '', tags: [] });
      setTagInput('');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit resource');
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // PreviewCard displays a live preview of the resource.
  const PreviewCard = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold text-blue-400 mb-2">
        {formData.title || 'Resource Title'}
      </h3>
      <p className="text-gray-400 mb-4">
        {formData.description || 'Resource description will appear here'}
      </p>
      {formData.url && (
        <a
          href={formData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <Link className="mr-2 text-white" size={20} />
          {formData.url}
        </a>
      )}
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-base"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Two-column layout: Editing Form on left, Live Preview on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Editing Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full h-12 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Resource title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white text-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              rows={4}
              placeholder="Resource description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              URL
            </label>
            <div className="relative">
              <Link
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={20}
              />
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="w-full h-12 pl-10 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 h-12 rounded-lg bg-gray-900 border border-gray-700 text-white text-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Add tags"
              />
              <button
                type="button"
                onClick={addTag}
                className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-base"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-gray-300"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedWebhookId}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Share Resource
          </button>
        </div>

        {/* Right Column: Live Preview */}
        <div>
          <h3 className="text-lg font-medium text-blue-400 mb-4">Preview</h3>
          <PreviewCard />
        </div>
      </div>
    </form>
  );
}
