<!-- @format -->

# DevWrite – Realtime Collaborative Text Editor

---

## 🚀 Project Overview

**DevWrite** is a modern, real-time collaborative text editor inspired by tools
like Google Docs and CodeSandbox. It allows users to log in via GitHub or
Google, create documents, and collaborate in real-time with others. Designed
with scalability in mind, it will evolve to support various content types,
including text, docx, markdown, and even code.

---

## 🧱 Tech Stack

-   **Frontend**: React.js (Vite), Tailwind CSS
-   **Backend**: Node.js + Express + Socket.IO
-   **Auth**: Firebase Authentication (Google & GitHub)
-   **Database**: Postgress
-   **Hosting**: Vercel (frontend), Render / Fly.io (backend)

---

## 🗂 Folder Structure

```text
/devwrite
├── client                 # React.js frontend (Vite)
│   └── src
│       ├── components
│       ├── pages
│       ├── context
│       └── hooks
│   ├── index.html
│   └── main.tsx
│
├── server                 # Node.js + Express + Socket.IO backend
│   ├── controllers
│   ├── routes
│   ├── sockets
│   └── server.ts
│
├── docs                   # Planning, design, and roadmap
│   ├── README.md
│   ├── system-design.md
│   └── feature-roadmap.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ✅ MVP Features

### 🔐 Authentication

-   [ ] Google + GitHub login via Firebase
-   [ ] Auth context with persistent session
-   [ ] Display logged-in user info

### 🏠 Dashboard

-   [ ] View previous documents
-   [ ] Create new document
-   [ ] Open existing document

### 📝 Text Editor

-   [ ] Large textarea
-   [ ] Auto-save
-   [ ] Clean UI with Tailwind

### 🔄 Realtime Collaboration

-   [ ] Sync text between users via Socket.IO
-   [ ] Join by doc URL
-   [ ] Basic debounce + sync

### 💾 Document Persistence

-   [ ] Save docs by user
-   [ ] Load docs into editor
-   [ ] Create new doc with default title

### 📱 UI/UX

-   [ ] Responsive layout
-   [ ] Mobile-friendly views

---

## 🔜 Future Additions

-   [ ] Markdown & rich text formatting
-   [ ] Syntax-highlighted code editing (Monaco Editor)
-   [ ] Document version history
-   [ ] PDF export
-   [ ] Invite collaborators with roles
-   [ ] Integrate Y.js for CRDT-based document syncing
-   [ ] Use Y-WebSocket for scalable real-time transport
-   [ ] Add offline editing with IndexedDB + Y.js
-   [ ] Support document version snapshots using Y.js history

---

## 🧠 Why This Project?

This project reflects the kind of technical depth, architecture thinking, and
end-to-end problem-solving expected at top-tier engineering roles. While it’s
personally fulfilling and user-facing, it’s also strategically built to
strengthen candidacy for Tier A tech companies by demonstrating real-time
collaboration, system design, and full-stack capability in action.

---

## 📜 License

[MIT License](./LICENSE)

---

## 📌 Author

Pritam Kininge  
[GitHub](https://github.com/kininge) |
[LinkedIn](https://linkedin.com/in/pritam-kininge) |
[Leetcode](https://leetcode.com/u/kininge007/)
