import React, { useState } from 'react';
import { ResourceForm } from './components/ResourceForm';
import { MessageForm } from './components/MessageForm';
import { HistoryView } from './components/HistoryView';
import { SettingsForm } from './components/SettingsForm';
import { Resource } from './types';
import { Share2, MessageSquare, History, Settings, Webhook } from 'lucide-react';
import { sendResource, sendMessage } from './utils/discord';
import { useStore } from './store/useStore';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState<'resources' | 'messages' | 'history' | 'settings'>('resources');
  const selectedWebhookId = useStore((state) => state.selectedWebhookId);
  const webhooks = useStore((state) => state.webhooks);
  const addResource = useStore((state) => state.addResource);

  const handleResourceSubmit = async (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    if (!selectedWebhookId) {
      toast.error('Please select a webhook first');
      return;
    }

    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!webhook) {
      toast.error('Selected webhook not found');
      return;
    }

    try {
      const fullResource: Resource = {
        ...resource,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        webhookId: selectedWebhookId,
      };

      await sendResource(fullResource);
      addResource(fullResource);
      toast.success('Resource shared successfully!');
    } catch (error) {
      console.error('Failed to share resource:', error);
      toast.error('Failed to share resource. Please check your webhook URL.');
    }
  };

  const handleMessageSubmit = async (message: string, scheduledDate?: Date) => {
    if (!selectedWebhookId) {
      toast.error('Please select a webhook first');
      return;
    }

    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!webhook) {
      toast.error('Selected webhook not found');
      return;
    }

    if (scheduledDate && scheduledDate > new Date()) {
      const scheduledMessage = {
        id: crypto.randomUUID(),
        content: message,
        webhookId: selectedWebhookId,
        scheduledFor: scheduledDate.toISOString(),
        type: 'message' as const,
      };
      useStore.getState().scheduleMessage(scheduledMessage);
      toast.success('Message scheduled successfully!');
    } else {
      try {
        await sendMessage(webhook.url, message);
        toast.success('Message sent successfully!');
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message. Please check your webhook URL.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Webhook className="h-8 w-8 text-blue-400 mb-2" />
          <h1 className="text-3xl font-bold text-white">ShareFlow</h1>
          <p className="mt-2 text-lg font-bold text-blue-400">
            Resource and Message Sharing
          </p>
        </div>


        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex">
              {[
                { id: 'resources', icon: Share2, label: 'Resources' },
                { id: 'messages', icon: MessageSquare, label: 'Messages' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`
                    flex items-center justify-center w-1/4 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                    ${activeTab === id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-blue-300 hover:border-blue-300'}
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-xl font-medium text-blue-400 mb-4">Share Resource</h2>
                <ResourceForm onSubmit={handleResourceSubmit} />
              </div>
            )}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-medium text-blue-400 mb-4">Send Message</h2>
                <MessageForm onSubmit={handleMessageSubmit} />
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-medium text-blue-400 mb-4">History</h2>
                <HistoryView />
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-medium text-blue-400 mb-4">Settings</h2>
                <SettingsForm />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toaster Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(251, 146, 60, 0.2)',
          },
        }}
      />
    </div>
  );
}

export default App;
