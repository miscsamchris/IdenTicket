# **IdenTicket: Secure Identity-Bound Ticketing System**

IdenTicket is a secure, blockchain-based ticketing system that integrates advanced technologies such as Aptos, Nillion, Petra Wallet, and Anon Aadhaar. The solution addresses critical issues like ticket fraud, unauthorized transfers, and secure identity verification while maintaining user privacy and data integrity.

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Flask-Server](#flask-server)
  - [Node-Server](#node-server)
  - [UserApplication](#userapplication)
  - [TicketChecker](#ticketchecker)
- [Usage](#usage)
- [Architecture Overview](#architecture-overview)
- [Integration Details](#integration-details)

## **Features**
- **Identity-Bound Ticketing:** Tickets are securely tied to verified identities using Anon Aadhaar, preventing unauthorized transfers.
- **Soul-Bound Tokens:** Tickets are issued as non-transferable tokens on the Aptos blockchain, stored in the Petra Wallet.
- **Secure 2FA with TOTP:** Nillion's AI provides secure, blind computation for generating and verifying Time-Based One-Time Passwords (TOTP).
- **Travel ETA Integration:** Nillion’s AI also powers accurate travel ETA predictions, offering additional value to users.

## **Technologies Used**
- **[Aptos](https://aptos.dev/):** For generating and storing soul-bound tokens, ensuring secure and non-transferable ticket ownership.
- **[Nillion](https://nillion.io/):** For secure TOTP generation, verification, and travel ETA computations using blind AI technology.
- **[Petra Wallet](https://petra.app/):** To securely store the soul-bound tokens linked to user identities.
- **[Anon Aadhaar SDK](https://anon-aadhaar.io/):** For Aadhaar-based identity verification, ensuring that only authenticated individuals can use the tickets.
- **[React](https://reactjs.org/):** Frontend framework for creating a seamless and intuitive user interface.
- **Node.js, Flask & Python:** Backend for handling API requests and managing server-side operations.

## **Installation**
### **Flask-Server**
- Install and setup the Nillion SDK
- Install Python and install all of the required files using
  ``` bash
    pip install -r requirements.txt
  ```
- Run the Nillion Devnet using the following command and then compile the nada programs
  ``` bash
      nillion-devnet --seed "MyApplication"
  ```
- Run the Python app using the following command after moving to the directory
  ``` bash
      python app.py
  ```

### Node-Server
- Install dependencies:
  ``` bash
      npm install
  ```
- Create a .env file in the root directory and add necessary environment variables: MONGODB_URI  and  OPENAI_API_KEY
- Start the server:
  ``` bash
      npm start
  ```
- The backend server will be running on http://localhost:3000.

### UserApplication
- Install dependencies:
  ``` bash
      npm install
  ```
- Start the development server:
  ``` bash
      npm run dev
  ```
- The frontend application will be available at http://localhost:5173.

### TicketChecker
- Install dependencies:
  ``` bash
      npm install
  ```
- Start the development server:
  ``` bash
      npm run dev
  ```
- The scanner application will be available at http://localhost:5174.

## **Usage**
- **User Registration**: Users register using Aadhaar, which is verified through the Anon Aadhaar SDK.
- **Ticket Purchase**: Tickets are issued as soul-bound tokens, stored securely in the Petra Wallet.
- **2FA Authentication**: Users authenticate using TOTP, generated and verified through Nillion’s secure, blind computation.
- **Travel ETA**: Users can also access real-time travel ETAs powered by Nillion’s AI.

## Architecture Overview
- **Frontend**: Built with React, the user interface handles registration, ticket purchase, and authentication processes.
- **Backend**:
  - **Python**: python with a flask server. handles token issuance, and communicates with Nillion for TOTP and travel ETA services.
  - **NodeJS**: Node.js with Express serves API requests and communicates with User Management Module.
- **Blockchain Integration**: Aptos blockchain manages the issuance and storage of soul-bound tokens, with Petra Wallet ensuring secure ownership.
- **Identity Verification**: Anon Aadhaar SDK verifies user identities before issuing tickets.

## **Integration Details**
- **Nillion Integration**: Nillion is used for blind computation of TOTP and travel ETA calculations. The React app communicates with Nillion’s API for these services.
- **Aptos & Petra Wallet**: Tokens are generated on the Aptos blockchain and stored in Petra Wallet, linked directly to verified Aadhaar identities.
- **Anon Aadhaar**: Integrated at the registration and ticket issuance stage to verify user identities securely.
