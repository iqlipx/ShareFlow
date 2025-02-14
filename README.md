# ShareFlow – Resource and Message Sharing


ShareFlow is a web-based tool designed to streamline resource and message sharing via Discord webhooks. With an intuitive interface for creating and sharing resource embeds, managing webhooks, and reviewing sharing history, ShareFlow makes it easy to distribute your work and communications efficiently.


## ✨ Features

- **📁 Resource Sharing:**  
  Create resource embeds with title, description, URL, and tags.  

- **💬 Message Sharing:**  
  Compose and send messages directly via Discord webhooks.  

- **🔗 Webhook Management:**  
  Easily add, update, select, and delete Discord webhooks.  

- **📜 History View:**  
  Filter and review shared resources by search, date, and tag.  

- **📱 Modern, Responsive UI:**  
  Built with React, Vite, and Tailwind CSS for a fast and responsive experience.


## ➕ Adding a Discord Webhook to ShareFlow

To use ShareFlow effectively, you need to add a Discord webhook from your server. Follow these steps:

### 🔑 Ensure You Have the Necessary Permissions
You need either the **"Manage Webhooks"** permission or **Administrator** permission on the desired Discord server and channel.

### 🛠️ Create a Webhook
1. Open Discord and navigate to the desired server and channel.
2. Click the gear icon (⚙️) next to the channel name to open the channel settings.
3. Go to the **Integrations** tab.
4. Click **Create Webhook**.
5. Provide a **Name** for the webhook and select the desired **Channel**.
6. Click **Copy Webhook URL**.

### 📋 Add the Webhook to ShareFlow
1. Open ShareFlow and navigate to the **Settings** → **Webhook Management** interface.
2. Paste the copied Webhook URL into the provided field and save it.
3. The webhook will now be available for sending resources and messages.



## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/iqlipx/ShareFlow.git
```

2. **Navigate to the Project Directory**

```bash
cd ShareFlow
```

3. **Install Dependencies**

  ```bash
  npm install
  ```

4. **Run the Development Server**

```bash
npm run dev
```

The application should now be running at http://localhost:5173.


## 📷 Screenshots


### 📤 Resource Sharing
![Resource Sharing](/images/resources.png)

### 💬 Messages
![Messages](/images/message.png)

### 📚 History
![History](/images/history.png)

### 🔗 Webhook Management
![Webhook Management](/images/webhook.png)

