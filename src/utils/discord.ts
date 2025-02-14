import type { Resource } from '../types';

export async function sendResource(resource: Resource): Promise<void> {
  const webhook = resource.webhookUrl;
  if (!webhook) throw new Error('No webhook URL provided');

  const embed = {
    title: resource.title,
    description: resource.description,
    url: resource.url,
    color: 0xff9933, // Orange color
    // If there are tags, combine them into a single field
    fields: resource.tags.length > 0 ? [{
      name: 'Tags',
      value: resource.tags.map(tag => '#' + tag).join(' '),
      inline: false,
    }] : [],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'ShareFlow made by iqlip 💖',
    },
  };

   const payload = {
     ...(resource.username && { username: resource.username }),
     embeds: [embed],
     ...(resource.fileUrl && { files: [{ attachment: resource.fileUrl }] }),
   };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send resource: ${response.statusText}`);
  }
}

export async function sendMessage(webhookUrl: string, message: string): Promise<void> {
  if (!webhookUrl) throw new Error('No webhook URL provided');

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
}
