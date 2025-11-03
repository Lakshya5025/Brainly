# **Brainly \- Your Second Brain in the Cloud**

Brainly is a powerful, full-stack application designed to be your personal digital brain. It allows you to effortlessly save, categorize, and access various types of content from around the web. Whether it's an inspiring image, a must-read document, a captivating video, a thought-provoking tweet, or an informative audio clip, Brainly provides a centralized hub for all your digital discoveries.

## **Features ✨**

- **Seamless Content Management**: Easily add, view, update, and delete your saved content.
- **Versatile Content Support**: Save a wide range of content types, including images, documents, videos, audio files, and even tweets.
- **Secure User Authentication**: Your digital brain is for your eyes only. Brainly uses secure, OTP-verified email signup and JWT (JSON Web Tokens) for session management.
- **Robust Security**: Passwords are securely hashed using **bcrypt**, ensuring that your account is always protected.
- **Effortless Sharing**: Share your saved content with others by generating unique, shareable links.
- **Powerful Search and Filtering**: Quickly find what you're looking for with a comprehensive search (by title or description) and filtering system (by content type or sort order).
- **Organize with Tags**: Use tags to categorize your content and keep your digital brain neatly organized.
- **User Profile Management**: Update your username, email, and password in a dedicated profile section.
- **Built with TypeScript**: The entire application is built with TypeScript, providing type safety and improved code quality.

## **Tech Stack 💻**

### **Frontend (Client)**

- **React 19**
- **Vite**
- **Tailwind CSS**
- **TypeScript**
- **Axios** (for API requests)
- **React Router** (for page routing)

### **Backend (Server)**

- **Node.js**
- **Express**
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **TypeScript**
- **JWT (JSON Web Tokens)** (for authentication)
- **Bcrypt** (for password hashing)
- **Zod** (for schema validation)
- **Nodemailer** (for sending OTP emails)

## **Project Structure**

The project is a monorepo, with the code organized into client and server directories.

brainly/  
├── client/ \# Frontend React/Vite application  
│ ├── src/  
│ │ ├── components/  
│ │ ├── icons/  
│ │ ├── pages/  
│ │ ├── App.tsx  
│ │ └── main.tsx  
│ ├── .env \# (You will create this)  
│ ├── package.json  
│ └── vite.config.ts  
│  
└── server/ \# Backend Node.js/Express application  
 ├── src/  
 │ ├── controller/ \# Request/response logic  
 │ ├── middleware/ \# Auth middleware  
 │ ├── models/ \# Mongoose schemas  
 │ ├── utils/ \# Email helper  
 │ └── validator/ \# Zod validators  
 ├── .env \# (You will create this)  
 ├── .example.env \# Environment variable template  
 ├── package.json  
 └── tsconfig.json

## **Getting Started 🚀**

Follow these instructions to get a copy of the project up and running on your local machine.

### **Prerequisites**

- **Node.js**: v18 or higher (as specified in server/package.json and client/package-lock.json)
- **npm**: (Comes with Node.js)
- **MongoDB**: A running instance of MongoDB (local or a cloud service like MongoDB Atlas).

---

### **1\. Backend (Server) Setup**

1. **Navigate to the server directory:**  
   Bash  
   cd brainly/server

2. **Install dependencies:**  
   Bash  
   npm install

3. Create an environment file:  
   Create a .env file in the server/ directory. Copy the contents of .example.env and fill in the values. You will also need to add variables for email and the client URL.  
   **server/.env**  
   Code snippet  
   \# From .example.env  
   MONGO_URL=your_mongodb_connection_string  
   PORT=8000  
   JWT_SECRET=your_super_secret_key_for_jwt  
   SALT=10

   \# Added from code (required for signup and sharing)  
   CLIENT_URL=http://localhost:5173  
   SERVER_URL=http://localhost:8000  
   EMAIL=your_gmail_address_for_sending_otp  
   EMAIL_PASSWORD=your_gmail_app_password

   _Note: For EMAIL_PASSWORD, you must generate an "App Password" from your Google account settings, not use your regular password._

4. **Build the TypeScript code:**  
   Bash  
   npm run build

   (This runs tsc \-b as defined in server/package.json)

5. **Start the server:**  
   Bash  
   npm start

   (This runs node dist/index.js as defined in server/package.json)  
   The server will connect to the database and start listening on the PORT you specified (e.g., http://localhost:8000).

---

### **2\. Frontend (Client) Setup**

1. **Open a new terminal** and navigate to the client directory:  
   Bash  
   cd brainly/client

2. **Install dependencies:**  
   Bash  
   npm install

3. Create an environment file:  
   The client needs to know where the backend API is. Create a .env file in the client/ directory.  
   (This step is missing from the original readme but is required by the code, e.g., in client/src/pages/Signin.tsx)  
   **client/.env**  
   Code snippet  
   VITE_API_URL=http://localhost:8000/api/v1

   _Note: Make sure the port (8000) matches the PORT in your **server's** .env file._

4. **Start the client:**  
   Bash  
   npm run dev

   (This runs vite as defined in client/package.json)

The client development server will start, typically at http://localhost:5173. You can now open this URL in your browser to use the application.

## **API Endpoints 🌐**

The server exposes the following REST API endpoints under the /api/v1 prefix.

- **User & Auth**
  - POST /signup: Creates a new user and sends an OTP.
  - POST /otp-verification: Verifies the OTP to activate a new user.
  - POST /signin: Logs in a user and returns a JWT token in an HTTP-only cookie.
  - POST /logout: Clears the JWT cookie to log out the user.
  - PUT /user: Updates the logged-in user's information (username, email).
  - POST /user/password: Changes the logged-in user's password.
- **Content (Brains)**
  - POST /content: Adds new content (link, tweet, doc, etc.) for the logged-in user.
  - GET /content: Fetches all content for the logged-in user. Supports search, sortBy, and sortOrder query params.
  - DELETE /content/:id: Deletes a specific piece of content by its ID.
  - PUT /content/:id: Updates the title and description of a specific piece of content.
- **Sharing**
  - POST /brain/share: Generates a unique, shareable link for a piece of content.
  - GET /brain/:shareLink: Accesses the shared content via its unique link (hash).

## **Future Scope 🔮**

The project has a solid foundation, and future work could include:

- Adding more robust error handling and feedback mechanisms.
- Implementing comprehensive unit and integration tests.
- Expanding the tagging functionality for more advanced organization.
- Enhancing the UI with features like content previews and a more interactive dashboard.
- Adding support for more content types and integrations with other platforms.
