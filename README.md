<div align="center">
  <h1>🏫 National School Climate Center Platform</h1>

  <p>
    <b>Empowering safer, more supportive schools</b><br>
    <i>Survey platform for measuring and improving school climate</i>
  </p>

  <br>

  <p>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick-Start-16A34A?style=for-the-badge" alt="Quick Start"></a>
    <a href="#-for-developers"><img src="https://img.shields.io/badge/For-Developers-DC2626?style=for-the-badge" alt="For Developers"></a>
    <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-7C3AED?style=for-the-badge" alt="Architecture"></a>
  </p>
</div>

---

## 📋 About

This platform enables the National School Climate Center to design, distribute, and analyze school climate surveys. Students can take anonymous surveys, while administrators and school leaders access real-time dashboards to improve school environments. 📊📚

This repository contains all the code and documentation needed to contribute. Please follow the setup guide below to get started!

---

## 📖 Contents

- [⚙️ Environment Setup](#%EF%B8%8F-environment-setup)
- [🏗️ Project Structure](#%EF%B8%8F-project-structure)
- [🗺️ System Overview](#%EF%B8%8F-system-overview)
- [🧑‍💻 Contributing Guidelines](./CONTRIBUTING.md)

---

## ⚙️ Environment Setup

<details open>
<summary><b>📂 Initial Steps</b></summary>
<br>

1. **Clone the Repository:**
   ```bash
   git clone <your-repo-url>
   cd national-school-climate-center
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
</details>

<details open>
<summary><b>🌐 Running the App Locally</b></summary>
<br>

1. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to see your running application.

2. **Run type checking:**
   ```bash
   npm run typecheck
   ```

3. **Run linting:**
   ```bash
   npm run lint
   ```
</details>

---

## 🏗️ Project Structure

<details open>
<summary><b>Directory Structure Overview</b></summary>
<br>

```
src/
├── components/                  # Reusable UI components
│   ├── ui/                     # Shadcn/ui components
│   ├── forms/                  # Survey form components
│   ├── charts/                 # Data visualization
│   └── layout/                 # Headers, navigation
├── pages/                      # Page components
│   ├── admin/                  # Admin dashboard pages
│   ├── survey/                 # Student survey pages
│   ├── leader/                 # School/district dashboards
│   └── auth/                   # Authentication pages
├── contexts/                   # React Context providers
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── types/                      # TypeScript definitions
└── firebase/                   # Firebase configuration
```
</details>

---

## 🗺️ System Overview

<table>
  <tr>
    <td width="50%">
      <h3>Frontend</h3>
      <ul>
        <li>React + TypeScript + Vite</li>
        <li>Tailwind CSS + Shadcn/ui</li>
        <li>React Router</li>
        <li>Firebase SDK</li>
      </ul>
    </td>
    <td width="50%">
      <h3>Backend</h3>
      <ul>
        <li>Firebase Authentication</li>
        <li>Firestore Database</li>
        <li>Cloud Functions</li>
      </ul>
    </td>
  </tr>
</table>

### User Flow Overview
- **Students**: Take anonymous surveys
- **School Leaders**: View school-specific data and export reports
- **NSCC Admins**: Create surveys, view all data, manage system

---

<div align="center">
  <h3>🎉 Ready to build safer schools! 🎉</h3>
  <p>Together, we'll help NSCC create positive learning environments! 🏫</p>
</div>
