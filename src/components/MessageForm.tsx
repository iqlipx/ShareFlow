import React, { useState } from 'react';
import { Eye, Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface MessageFormProps {
  onSubmit: (message: string) => Promise<void>;
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const selectedWebhookId = useStore((state) => state.selectedWebhookId);
  const webhooks = useStore((state) => state.webhooks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWebhookId) {
      toast.error('Please select a webhook first');
      return;
    }

    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!webhook) {
      toast.error('Selected webhook not found');
      return;
    }

    try {
      await onSubmit(message);
      setMessage('');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const PreviewCard = () => {
    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          {webhook?.imageUrl ? (
            <img
              src={webhook.imageUrl}
              alt={webhook.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h4 className="text-lg font-bold text-white">
              {webhook?.name || 'Webhook'}
            </h4>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-white whitespace-pre-wrap text-lg">
            {message || 'Your message will appear here'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Preview Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Compose Message
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-blue-400 transition-colors"
        >
          <Eye size={18} />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {showPreview && (
        <div className="mb-6">
          <PreviewCard />
        </div>
      )}

      {/* Message Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full h-32 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Enter your message"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedWebhookId}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg hover:from-blue-500 hover:to-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
