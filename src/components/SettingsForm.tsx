import React from 'react';
import { WebhookManager } from './WebhookManager';

export function SettingsForm() {
  return (
    <div className="space-y-8">
      <WebhookManager />
    </div>
  );
}