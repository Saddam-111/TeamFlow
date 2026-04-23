# TEAMFLOW<img width="1920" height="1080" alt="Screenshot 2026-04-23 143110" src="https://github.com/user-attachments/assets/f01a2844-fc55-45fd-8850-2c79cd5b69c5" />
: A Real-Time Collaboration Platform

Ever wished you could work on a document with your team without the endless cycle of saving, refreshing, and merge conflicts? That's exactly what RealTimeCollab solves. Built with the MERN stack and powered by WebSockets, this app lets multiple users edit, comment, and interact in real-time—think Google Docs but with your own flavor.

## ✨ Features

- **Live Synchronization**: See changes from other users instantly as they type
- **Multi-user Cursors**: Watch collaborators' cursors and selections in real-time
- **Rich Text Editing**: Format text, add lists, and insert media collaboratively
- **Presence Indicators**: Know who's online and viewing the document
- **Commenting System**: Leave threaded comments on specific sections
- **Version History**: Track changes and revert to previous states
- **User Authentication**: Secure login and registration with JWT
- **Responsive Design**: Works seamlessly on desktop and tablet

## 🧠 How It Works

### Backend (Node.js + Express)
The server handles RESTful APIs for user authentication, document storage, and comment management. Express.js routes organize our endpoints, while MongoDB (via Mongoose) persists all data. We've structured our controllers and services to keep business logic separate from route handling.

### Frontend (React)
Our React app uses functional components with hooks for state management. We leverage Context API for global state (like user auth and active document) and Redux for more complex document state. The UI updates optimistically—we show changes immediately while syncing with the backend in the background.

### Database (MongoDB)
We store:
- User profiles (hashed passwords, preferences)
- Documents (content as JSON, metadata)
- Comments (linked to document and user)
- Version snapshots (for history)

### Real-time Layer (WebSockets via Socket.io)
This is where the magic happens. Socket.io establishes persistent connections between clients and server. When a user makes an edit:
1. Client sends the change through Socket.io
2. Server broadcasts it to all other clients in the same room
3. Each client applies the change to their local state
4. We use Operational Transformation (OT) to resolve conflicts when edits overlap

## 🛠️ Tech Stack

**Frontend**: React.js, React DOM, Socket.io-client, Context API, Redux Toolkit, CSS Modules  
**Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT, Bcrypt  
**Database**: MongoDB  
**Dev Tools**: Git, ESLint, Prettier, Nodemon (dev), Concurrently  
**Deployment**: Ready for Docker, Heroku, or AWS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RealTimeCollab.git
   cd RealTimeCollab
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   Create `.env` files in both `server` and `client` directories:
   ```env
   # server/.env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000

   # client/.env
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   # From project root
   npm run dev
   ```
   This uses `concurrently` to start both client (`npm start`) and server (`npm run dev`) in parallel.

   Or start them separately:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm start
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to use the app.

## 🚀 Usage

1. **Sign up** or **log in** to create your account
2. **Create a new document** or join an existing one using a shareable link
3. **Start editing**—you'll see your cursor and can begin typing immediately
4. **Invite collaborators** by sharing the document link (they'll need to log in)
5. **Use the toolbar** to format text, insert elements, or add comments
6. **View presence indicators** at the top to see who's online
7. **Access version history** from the file menu to review or restore past states

## 📸 Screenshots

![Login Page]
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143110" src="https://github.com/user-attachments/assets/7c24d264-e86e-410e-963f-c84a17e2f211" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143129" src="https://github.com/user-attachments/assets/29015c4a-61a4-4b10-984a-4f67678cf334" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143153" src="https://github.com/user-attachments/assets/ccb1a977-9a54-4f61-b5aa-0ec72573e9b2" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143211" src="https://github.com/user-attachments/assets/336509d6-bbca-43d6-a102-fc408faa666a" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143221" src="https://github.com/user-attachments/assets/3f58ef89-dbdf-442d-b638-849dc1ffeba0" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143231" src="https://github.com/user-attachments/assets/1d4c2785-f742-44a8-96b6-6614d5cd6e4d" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143240" src="https://github.com/user-attachments/assets/6e218129-9130-47b4-8746-5c5012a410b1" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 143454" src="https://github.com/user-attachments/assets/140d6ece-4208-4cc5-89bb-3e67c91f11c5" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 163546" src="https://github.com/user-attachments/assets/69737e5e-4dd1-4c4d-83c0-7bfc4bc20c2f" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 163612" src="https://github.com/user-attachments/assets/c9eb4751-19b0-4939-b502-a428455b4e7c" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 163633" src="https://github.com/user-attachments/assets/bec1f8a4-84bc-4c05-981f-399226ae2d35" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 163653" src="https://github.com/user-attachments/assets/399f179e-75f1-445c-b59b-55f560b0fa48" />
<img width="1920" height="1080" alt="Screenshot 2026-04-23 163705" src="https://github.com/user-attachments/assets/6b8c424c-0cc9-45d0-aa21-547d39082621" />

## 📁 Project Structure

```
RealTimeCollab/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific modules (auth, documents, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context providers
│   │   ├── redux/          # Redux store and slices
│   │   ├── utils/          # Helper functions
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (auth, validation)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── sockets/            # Socket.io event handlers
│   ├── utils/              # Helper functions
│   ├── server.js           # Entry point
│   └── package.json
└── README.md
```

## ⚙️ Future Improvements

- **Offline Support**: Implement local caching with IndexedDB for interrupted connections
- **Video/Audio Chat**: Integrate WebRTC for face-to-face collaboration within documents
- **Advanced Permissions**: Role-based access control (viewer, commenter, editor)
- **Template Library**: Pre-built templates for common document types (meeting notes, project plans)
- **Mobile App**: React Native companion app for iOS/Android
- **Analytics Dashboard**: Document usage statistics and contributor insights
- **Third-party Integrations**: Connect with Google Drive, Slack, and Trello

## 🤝 Contributing

We love contributions! Whether it's fixing bugs, improving documentation, or adding new features:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure your code follows our ESLint and Prettier configurations, and include tests for new functionality.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by developers who believe collaboration should be frictionless. If you find this useful, consider giving it a star ⭐—it helps us keep improving!
