# OneHandle — Privacy-First Tab Manager

A privacy-focused, premium Chrome extension to manage, search, export, and favorite your tabs.
Designed with a modern, glassmorphic UI and built for speed.

## ✨ Features

- **🚀 Instant Search**: Filter through open tabs and favorites in real-time.
- **🔒 Privacy First**: All data is stored locally (`chrome.storage.local`). No analytics, no tracking, no external server calls.
- **📂 Smart Grouping**: Tabs are automatically grouped by window.
- **⭐ Favorites**: Pin your most used tabs for quick access.
- **📤 Bulk Export**: Export your tabs to CSV, Excel, PDF, or ZIP formats.
- **📋 One-Click Copy**: Copy tab URLs to your clipboard instantly.
- **🎨 Modern UI**: Beautiful dark/light mode adaptable interface with smooth animations.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Variables + Flexbox/Grid)
- **Icons**: Lucide React
- **Export Libraries**: `xlsx`, `pdf-lib`, `jszip`

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/brusooo/Onehandle.git
   cd Onehandle
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with the production-ready extension.

### Loading into Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `dist` folder from this project.
5. Pin the extension and click the icon to use!

## 💻 Development

To start the development server (for UI development):

```bash
npm run dev
```

_Note: Chrome APIs (like `chrome.tabs`) won't work in the standard browser tab during `npm run dev`. To test functionality, you must build and reload the extension in Chrome._

## 📦 Project Structure

```
src/
├── popup/          # UI Components (Popup, TabList, Favorites)
├── types/          # TypeScript interfaces
├── utils/          # Helper functions (tabs, storage, export)
└── assets/         # Static assets
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
