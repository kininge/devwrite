# DevWrite – Realtime Collaborative Text Editor

---

## 🚀 Project Overview
**DevWrite** is a modern, real-time collaborative text editor inspired by tools like Google Docs and CodeSandbox. It allows users to log in via GitHub or Google, create documents, and collaborate in real-time with others. Designed with scalability in mind, it will evolve to support various content types, including text, docx, markdown, and even code.

---

## 🧱 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Auth**: Firebase Authentication (Google & GitHub)
- **Database**: MongoDB / Firestore / Supabase (to be finalised)
- **Hosting**: Vercel (frontend), Render / Fly.io (backend)

---

## 🗂 Folder Structure
/devwrite
/client # React.js frontend (Vite)
/src
/components
/pages
/context
/hooks
index.html
main.jsx

/server # Node.js + Express + Socket.IO backend
/controllers
/routes
/sockets
server.js

/docs # Planning, design, and roadmap
README.md
system-design.md
feature-roadmap.md

.gitignore
LICENSE
README.md


---

## ✅ Core Features (MVP)
- [ ] Google + GitHub login via Firebase
- [ ] User dashboard with doc history
- [ ] Create/edit plain text documents
- [ ] Share & collaborate in realtime (Socket.IO)
- [ ] Document persistence per user
- [ ] Responsive UI with Tailwind

---

## 🔜 Future Additions
- [ ] Markdown & rich text formatting
- [ ] Syntax-highlighted code editing (Monaco Editor)
- [ ] CRDT-based conflict resolution
- [ ] Document version history
- [ ] PDF export
- [ ] Invite collaborators with roles

---

## 🧠 Why This Project?
This is more than a portfolio piece. DevWrite reflects full-stack engineering depth, system design understanding, frontend polish, and real-time programming expertise — all of which matter for Tier A tech roles.

---

## 📜 License
[MIT License](./LICENSE)

---

## 📌 Author
Pritam Kininge  
[GitHub](https://github.com/kininge) | [LinkedIn](https://linkedin.com/in/pritam-kininge)

