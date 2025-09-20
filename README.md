# 💼 Token Portfolio

A responsive crypto portfolio tracker built with **React, RainbowKit, Wagmi, Redux Toolkit, and Recharts**.  
This App allows you to connect your wallet, track live token prices, visualize portfolio distribution, and manage a watchlist with ease.

---

## ✨ Features

- 🔗 **Wallet Integration** – Connect via [RainbowKit](https://www.rainbowkit.com/) & Wagmi  
- 📊 **Live Portfolio Value** – Real-time token pricing with percentage distribution  
- 📈 **Charts & Visualization** – Recharts-powered portfolio breakdown  
- ⏱ **Price Refresh** – Refresh live prices instantly with smooth animations (Framer Motion)  
- 📜 **Watchlist** – Track multiple tokens with price, % change, sparkline & holdings  
- 🎨 **Responsive UI** – Mobile-friendly design powered by TailwindCSS  
- 🛠 **State Management** – Global state with Redux Toolkit  
- ⚡ **Optimized** – React Query for data fetching & caching  

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite  
- **Styling:** TailwindCSS, Framer Motion, Lucide Icons  
- **Wallet & Web3:** RainbowKit, Wagmi, Viem  
- **State Management:** Redux Toolkit, React Query  
- **Charts:** Recharts  
- **Utilities:** Axios, ESLint, PostCSS  

---
src/
├── components/ # Reusable UI components (Navbar, Charts, Buttons, etc.)
├── hooks/ # Custom React hooks
├── redux/ # Redux slices and store
├── utils/ # Helper functions (e.g., getTokenColor)
├── App.tsx # Root component
└── main.tsx # App entry point


---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/werahul/fintech-dashboard.git
   cd fintech-dashboard

## 📂 Project Structure

npm install
# or
yarn install

npm run dev

📱 Responsive Design

Mobile: Compact layout with icons only (e.g., Refresh button without text)

Tablet/Desktop: Full watchlist with text, charts, and controls

Dynamic Components: Buttons and charts adapt based on screen size

📸 Demo Preview [https://fintech-dashboard-vert.vercel.app]

Portfolio Summary: Shows total value & percentage breakdown

Watchlist Table: Displays token prices, % change, sparkline, holdings, and value

Responsive Refresh Button: Shows only icon on mobile, full text + icon on desktop
