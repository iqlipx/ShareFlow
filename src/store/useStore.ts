import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Webhook, Resource, MessageTemplate, ScheduledMessage } from '../types';

interface State {
  webhooks: Webhook[];
  resources: Resource[];
  templates: MessageTemplate[];
  scheduledMessages: ScheduledMessage[];
  selectedWebhookId: string | null;
  addWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  updateWebhook: (id: string, webhook: Partial<Webhook>) => void;
  deleteWebhook: (id: string) => void;
  setSelectedWebhook: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  addTemplate: (template: Omit<MessageTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  scheduleMessage: (message: Omit<ScheduledMessage, 'id'>) => void;
  deleteScheduledMessage: (id: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      webhooks: [],
      resources: [],
      templates: [],
      scheduledMessages: [],
      selectedWebhookId: null,

      addWebhook: (webhook) =>
        set((state) => ({
          webhooks: [...state.webhooks, { ...webhook, id: crypto.randomUUID() }],
        })),

      updateWebhook: (id, webhook) =>
        set((state) => ({
          webhooks: state.webhooks.map((w) =>
            w.id === id ? { ...w, ...webhook } : w
          ),
        })),

      deleteWebhook: (id) =>
        set((state) => ({
          webhooks: state.webhooks.filter((w) => w.id !== id),
          selectedWebhookId:
            state.selectedWebhookId === id ? null : state.selectedWebhookId,
        })),

      setSelectedWebhook: (id) =>
        set(() => ({
          selectedWebhookId: id,
        })),

      addResource: (resource) =>
        set((state) => ({
          resources: [
            ...state.resources,
            {
              ...resource,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, { ...template, id: crypto.randomUUID() }],
        })),

      updateTemplate: (id, template) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...template } : t
          ),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      scheduleMessage: (message) =>
        set((state) => ({
          scheduledMessages: [
            ...state.scheduledMessages,
            { ...message, id: crypto.randomUUID() },
          ],
        })),

      deleteResource: (resourceId: string) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== resourceId),
        })),

      deleteScheduledMessage: (id) =>
        set((state) => ({
          scheduledMessages: state.scheduledMessages.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'resource-sharing-storage',
    }
  )
);