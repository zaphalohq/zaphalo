<div align="center">
   <h1>ZapHalo</h1>
   <p><strong>Open Source WhatsApp API Integration and Business Solutions</strong></p>
</div>
</div>

**ZapHalo** is a powerful WhatsApp API-integrated application designed for businesses and individuals to streamline messaging workflows. With a single phone number, users can integrate ZapHalo across multiple platforms (e.g., websites, apps), receive and manage messages via WhatsApp webhooks, leverage chatbot automation, and send bulk messages to millions of recipients efficiently. Inspired by platforms like Wati.io, ZapHalo offers an end-to-end solution for multi-channel messaging and customer engagement.

<div align="center">
   <img src="./packages/frontend/public/dashboardScreenShot.png" alt="ZapHalo — WhatsApp API Integration" width="900" />
   <p><em>Screenshot: ZapHalo dashboard</em></p>
</div>

## Features
- **Multi-Platform Integration**: Embed your WhatsApp number on websites, apps, or other platforms with a simple link or widget.
- **Webhook Message Handling**: Capture incoming WhatsApp messages in real-time using webhooks and display them within the app.
- **Chatbot Functionality**: Automate responses with a no-code chatbot builder for FAQs, customer support, and lead generation.
- **Bulk Messaging**: Send personalized messages to millions of contacts from a single number, perfect for marketing campaigns or notifications.
- **Real-Time Messaging**: Leverage WebSocket (Socket.IO) for instant two-way communication.
- **Authentication**: Secure access with JWT-based authentication via GraphQL Auth Guard.
- **Persistent Storage**: Store messages and chat data in PostgreSQL and local storage for seamless session management.
- **Scalable Communication**: Handle large-scale messaging without compromising performance.

## Tech Stack
- **Backend**: NestJS, TypeORM, PostgreSQL, Socket.IO
- **Frontend**: React, Apollo Client, Socket.IO Client
- **WhatsApp Integration**: WhatsApp Business API, Webhooks
- **Authentication**: JWT, GqlAuthGuard
- **Storage**: LocalStorage (client-side), PostgreSQL (server-side)

## Prerequisites
Before installing, ensure you have the following installed:
- **Node.js**: v22.x or higher
- **npm**: v10.x or higher (or use Yarn/Pnpm)
- **PostgreSQL**: v17.x or higher
- **Git**: For cloning the repository
- **WhatsApp Business API Account**: Approved account from Meta or a WhatsApp Business Solution Provider (BSP)

---

## Installation Process

### 1. Clone the Repository
```bash
git clone https://github.com/zaphalohq/zaphalo.git
cd zaphalo
```

### 2. Set Up Environment Variables
Create `.env` files in both the backend and frontend directories.

You can create your `.env` files by copying the provided `.env.example` files in each directory:

#### Backend (e.g., `packages/server/.env`)
- copy `.env.example` file in new `.env` file by this command
```bash
cp packages/server/.env.example packages/server/.env
```

- your backend `.env` file look like:
```env
# Use this for local setup
NODE_ENV=development
PG_DATABASE_URL=your_db_url
APP_SECRET=replace_me_with_a_random_string
WEBSOCKET_PORT=4000
FRONTEND_URL=http://localhost:5173
```

#### Frontend (e.g., `packages/frontend/.env`)
copy `.env.example` file in new `.env` file by this command
```bash
cp packages/frontend/.env.example packages/frontend/.env
```

- your frontend `.env` file look like:
```env
VITE_BACKEND_URL='http://localhost:3000'
VITE_WEBSOCKET_URL='http://localhost:4000'
```


### 3. Install Dependencies

#### packages
```bash 
cd packages
yarn install
```

#### Backend
```bash
cd packages/server
yarn install
```

#### Frontend
```bash
cd packages/frontend
yarn install
```

### 4. Set Up the Database

1. **Run Migrations** (if using TypeORM migrations):
 - In a new terminal:
   ```bash
   yarn nx start server
   yarn nx command:prod server upgrade
   yarn nx database:migrate:workspace:run server
   ```

### 5. Start the Backend
In a new terminal:
```bash
cd packages/server
yarn nx start
```
- The server will run on `http://localhost:3000` (GraphQL at `/graphql`, Webhook at `/webhook`) and Socket.IO on `ws://localhost:8080`.

OR (from repo root, start the server project directly):
```bash
yarn nx start server
```

### 6. Start the Frontend
In a new terminal:
```bash
cd packages/client
yarn nx start
```
- The React app will run on `http://localhost:5173` (default Vite port).

OR (from repo root, start the frontend project directly):
```bash
yarn nx start frontend
```

### 7. Verify the Setup
- Open your browser to `http://localhost:5173`.
- Use GraphQL Yoga at `http://localhost:3000/graphql` to test queries.
- Send a test message to your WhatsApp number and check if it appears in the app.
- Test bulk messaging by uploading a contact list and sending a message.


## Usage
1. **Integrate WhatsApp Number**:
   - Share your WhatsApp number (e.g., via a link like `https://wa.me/your_whatsapp_number`) on websites or apps.
2. **Receive Messages**:
   - Incoming messages are captured via the webhook and displayed in the ZapHalo app.
3. **Bulk Messaging**:
   - Upload a CSV of phone numbers and send a single message to millions of recipients.
4. **Real-Time Interaction**:
   - Use the app to reply to messages instantly via WebSocket.


## Troubleshooting
- **Database Connection Failed**:
  - Check `.env` credentials and ensure PostgreSQL is running (`pg_ctl status` or `ps aux | grep postgres`).
- **GraphQL Errors**:
  - Validate the schema (`schema.gql`) and resolver logic.
- **Bulk Messaging Limits**:
  - Ensure compliance with WhatsApp’s rate limits and policies.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---