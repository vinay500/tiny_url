# 🚀 TinyLink – Simple URL Shortener

TinyLink is a **simple full-stack URL shortener** designed for efficiency. Users can quickly create short links, manage them from a centralized dashboard, and gain insights into link performance through detailed click statistics.

## ✨ Features

* 🔗 **Shorten Long URLs:** Instantly convert lengthy links into concise short codes.
* 🖋️ **Custom Short Codes:** Support for creating unique and memorable short codes.
* 🎯 **Fast Redirection:** Redirect users using the clean path structure: `/`**`:code`**.
* 📊 **Click Tracking:**
    * Track **Total Clicks**.
    * Record the **Last Clicked Time**.
* 📈 **View Detailed Stats:** Access performance metrics for every individual link.
* 🗑️ **Link Management:** Easily delete short links from the dashboard.

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
| :--- | :--- |
| **Framework** | React + Vite + **TypeScript** |
| **State Management** | Redux Toolkit |
| **Styling** | ShadCN + TailwindCSS |

### Backend
| Category | Technology |
| :--- | :--- |
| **Server** | Node.js + Express + **TypeScript** |
| **Database** | PostgreSQL (**Neon**) |

---

## 💻 Local Setup Guide

Follow these steps to get the application running on your local machine.

### 🔧 1. Backend Setup (`tinylink-backend`)

The backend serves the API and handles the redirection logic.

1.  **Navigate to the backend directory:**
    ```bash
    cd tinylink-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root of the `tinylink-backend` folder and add your configuration:
    ```ini
    DATABASE_URL=your_neon_postgres_url_here
    PORT=5000
    ```
    > **Note:** Replace `your_neon_postgres_url_here` with your actual Neon PostgreSQL connection string.

4.  **Start the backend (Development):**
    ```bash
    npm run dev
    ```
    The backend will be running at: **`http://localhost:5000`**

5.  **Build & Start (Production):**
    ```bash
    npm run build
    npm start
    ```

### 🎨 2. Frontend Setup (`tinylink-frontend`)

The frontend provides the user interface for creating and managing links.

1.  **Navigate to the frontend directory:**
    ```bash
    cd tinylink-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root of the `tinylink-frontend` folder to point to the backend:
    ```ini
    VITE_API_BASE_URL=http://localhost:5000
    ```

4.  **Start the frontend (Development):**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at: **`http://localhost:5173`**

---

## 🌐 Application URLs (Local)

| Component | URL |
| :--- | :--- |
| **Frontend Dashboard** | `http://localhost:8080` |
| **Backend API Server** | `http://localhost:5000` |

### **Redirection Example**

Access a short link directly via the backend URL:
`http://localhost:5000/google` **→** *redirects to the original URL*

## 🔗 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/links` | Create a new short link. |
| `GET` | `/api/links` | Retrieve all short links (for the dashboard). |
| `GET` | `/api/links/:code` | Get detailed statistics for a specific link code. |
| `DELETE` | `/api/links/:code` | Delete a short link by its code. |
| `GET` | `/:code` | **Redirect** to the original URL and log the click. |
