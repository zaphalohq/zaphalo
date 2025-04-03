# YaariAPI

**YaariAPI** is a powerful WhatsApp API-integrated application designed for businesses and individuals to streamline messaging workflows. With a single phone number, users can integrate YaariAPI across multiple platforms (e.g., websites, apps), receive and manage messages via WhatsApp webhooks, leverage chatbot automation, and send bulk messages to millions of recipients efficiently. Inspired by platforms like Wati.io, YaariAPI offers an end-to-end solution for multi-channel messaging and customer engagement.

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
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher (or use Yarn/Pnpm)
- **PostgreSQL**: v13.x or higher
- **Git**: For cloning the repository
- **WhatsApp Business API Account**: Approved account from Meta or a WhatsApp Business Solution Provider (BSP)

---

## Installation Process

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/YaariAPI.git
cd YaariAPI
```

### 2. Set Up Environment Variables
Create `.env` files in both the backend and frontend directories.

#### Backend (e.g., `packages/server/.env`)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_postgres_user
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=YaariAPI_db

# JWT
JWT_SECRET=your_jwt_secret_key

# WhatsApp API
WHATSAPP_API_TOKEN=your_whatsapp_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Webhook
WEBHOOK_URL=http://localhost:3000/webhook
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Socket.IO
SOCKET_PORT=8080
```

#### Frontend (e.g., `packages/client/.env`)
```env
VITE_API_URL=http://localhost:3000/graphql
VITE_WS_URL=ws://localhost:8080
VITE_WHATSAPP_NUMBER=your_whatsapp_number
```

### 3. Install Dependencies

#### pacjages
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
   ```bash
   cd packages/server
   yarn start
   yarn database:migrate:prod
   or
   yarn nx run server:typeorm migration:run -d src/database/typeorm/core/core.datasource.ts
   ```

### 5. Configure WhatsApp Webhook
1. your server should be live not run locally use ngrock like apps.
2. Log in to your WhatsApp Business API provider (e.g., Meta Business Manager).
3. Set the webhook URL to `http://localhost:3000/webhook` (or your production URL).
4. Use the `WEBHOOK_VERIFY_TOKEN` from your `.env` to verify the webhook.
5. Subscribe to events like `messages` to receive incoming messages.

### 6. Start the Backend
In a new terminal:
```bash
cd packages/server
yarn run start
```
- The server will run on `http://localhost:3000` (GraphQL at `/graphql`, Webhook at `/webhook`) and Socket.IO on `ws://localhost:8080`.

### 7. Start the Frontend
In a new terminal:
```bash
cd packages/client
yarn run dev
```
- The React app will run on `http://localhost:5173` (default Vite port).

### 8. Verify the Setup
- Open your browser to `http://localhost:5173`.
- Use GraphQL Playground at `http://localhost:3000/graphql` to test queries.
- Send a test message to your WhatsApp number and check if it appears in the app.
- Test bulk messaging by uploading a contact list and sending a message.


## Usage
1. **Integrate WhatsApp Number**:
   - Share your WhatsApp number (e.g., via a link like `https://wa.me/your_whatsapp_number`) on websites or apps.
2. **Receive Messages**:
   - Incoming messages are captured via the webhook and displayed in the YaariAPI app.
3. **Chatbot Automation**:
   - Configure the chatbot in the app to respond to common queries (e.g., "Hi" → "Hello! How can I assist you?").
4. **Bulk Messaging**:
   - Upload a CSV of phone numbers and send a single message to millions of recipients.
5. **Real-Time Interaction**:
   - Use the app to reply to messages instantly via WebSocket.


## Troubleshooting
- **Webhook Not Receiving Messages**:
  - Verify the `WEBHOOK_URL` and `WEBHOOK_VERIFY_TOKEN` in your WhatsApp Business API settings.
  - Ensure your server is publicly accessible (use ngrok for local testing: `ngrok http 3000`).
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