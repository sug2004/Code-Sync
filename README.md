# Code-Sync

Code-Sync is a collaborative coding platform that enables developers to work together on the same codebase in real-time using a shared room ID.

## Features
- Real-time collaborative code editing
- Seamless integration between frontend and backend
- User-friendly interface
- Scalable and responsive design

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (version 14.x or later)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sug2004/Code-Sync.git
   cd Code-Sync
   ```

2. **Install dependencies:**
   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend application:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   Open your web browser and go to `http://localhost:3000` (or the specified port).

## User Experience

### Login Page
The login page offers an intuitive interface for users to join a collaborative coding session. Users can:
- Enter a **Room ID** to connect to an existing session.
- Enter their **Username** to identify themselves during the session.
- Click the **Join** button to start collaborating.

![Login Page](./images/login-page.png)

> *If you don’t have an invite, you can create a new room using the provided option.*

### Collaborative Workspace
Once inside a room, users are presented with a clean and responsive editor interface:
- **Sidebar:** Displays the list of connected users with their usernames and avatars for better collaboration visibility.
- **Code Editor:** Supports real-time editing and synchronization, allowing multiple users to work on the same code simultaneously.
- **Room Controls:**
  - **Copy Room ID:** Easily share the room ID with others.
  - **Leave Button:** Exit the session when done.

![Collaborative Workspace](./images/collaborative-workspace.png)

## Project Structure

```
Code-Sync/
├── backend/         # Backend API and server-side logic
├── frontend/        # Frontend React application
├── README.md        # Project documentation
└── package.json     # Dependency configuration
```

## Technologies Used
- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Other:** Socket.IO for real-time communication

## Contributing
Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/YourFeatureName`
5. Submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions or support, please reach out via [GitHub Issues](https://github.com/sug2004/Code-Sync/issues).

---
Happy Coding! 🚀

