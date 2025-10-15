# Branch Customer Service Messaging Web App

This is a full-stack web application designed to streamline customer service for Branch International. It provides a real-time portal for a team of agents to view, assign, and respond to a high volume of customer inquiries efficiently.

## Features Implemented

This project includes all the basic requirements as well as several of the suggested extensions to create a more robust and feature-rich platform.

### Core Features
- **Full-Stack Application:** Built with React, Node.js, Express, and MySQL.
- **Agent Portal:** A centralized dashboard for agents to view all incoming customer messages.
- **Reply System:** Agents can view individual messages and send responses.
- **Database Integration:** Customer messages from the provided CSV file are stored and managed in a MySQL database.
- **Customer Form Simulation:** An API endpoint and web form are provided to simulate new incoming messages from customers.

### Additional Features
- **Real-Time UI (WebSockets):** The agent dashboard updates in real-time. New messages and status changes appear instantly for all agents without requiring a page refresh.
- **Agent Work Division Scheme:** A "claim-based" assignment system prevents multiple agents from working on the same message. An agent must click "Assign to Me" to lock a message, making it un-editable for other agents.
- **Urgency Flagging & Prioritization:** Incoming messages are automatically analyzed for keywords (e.g., "loan," "payment," "approval"). Urgent messages are flagged and prioritized at the top of the agent queue, followed by the newest messages.
- **Advanced Sorting:** Resolved queries are automatically moved to the bottom of the list, keeping the active queue clean.
- **Canned Message Feature:** Agents can use pre-configured stock messages to respond to common inquiries quickly.
- **Enhanced Search Functionality:** The search bar allows agents to filter messages by both the **message content** and the **User ID**.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Real-Time Communication:** Socket.io

---

## Setup and Installation Instructions

Please follow these instructions to set up and run the project on a local machine. This guide assumes no initial setup has been done.

### 1. Prerequisites

Before you begin, you need to have the following software installed on your machine:

- **Node.js:** (Version 14 or later) - [Download Node.js](https://nodejs.org/en/download/)
- **MySQL:** - [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

### 2. Clone the Repository

First, clone the project repository from GitHub to your local machine.
```bash
git clone <your-repository-url>
cd <repository-name>
```
### 3. Database Setup

You need to create the database and the required tables.

1.  Log in to your MySQL client using your root user:
    ```bash
    mysql -u root -p
    ```
2.  Run the following SQL commands one by one to set up the database.

    ```sql
    -- Create the database
    CREATE DATABASE branch_messaging_enhanced;

    -- Select the database to use
    USE branch_messaging_enhanced;

    -- Create the 'messages' table
    CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        timestamp DATETIME,
        message_body TEXT,
        agent_reply TEXT,
        urgent BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'unassigned',
        assigned_agent_id INT
    );

    -- Create and populate the 'canned_messages' table
    CREATE TABLE canned_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        message TEXT
    );

    INSERT INTO canned_messages (title, message) VALUES
    ('Loan Approval Time', 'Your loan is currently under review. The approval process typically takes 24-48 hours. We appreciate your patience.'),
    ('Disbursement Information', 'Once your loan is approved, the funds will be disbursed to your registered mobile money account within a few hours.'),
    ('How to Update Information', 'You can update your personal information in the "Profile" section of the app. Please ensure all details are accurate.');

    -- IMPORTANT: Update the root user's authentication method for compatibility
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
    ```
    > **Note:** In the `ALTER USER` command, replace `'your_password'` with your actual MySQL root password.

### 4. Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Create a `.env` file for your database credentials by copying the example file:
    ```bash
    cp .env.example .env
    ```
3.  Open the newly created `.env` file in a text editor and add your MySQL password:
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password  # <-- Replace with your actual password
    DB_NAME=branch_messaging_enhanced
    ```
4.  Install the required backend dependencies:
    ```bash
    npm install
    ```
5.  Run the script to import the initial message data from the CSV file into your database.
    > **Note:** Make sure the `GeneralistRails_Project_MessageData.csv` file is in the root project directory.
    ```bash
    node import-csv.js
    ```

### 5. Frontend Setup

1.  Open a **new terminal window**.
2.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
3.  Install the required frontend dependencies:
    ```bash
    npm install
    ```

### 6. Running the Application

You need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server:** In your first terminal (in the `server` directory), run:
    ```bash
    node server.js
    ```
    > The server will be running on `http://localhost:5000`.

2.  **Start the Frontend Application:** In your second terminal (in the `client` directory), run:
    ```bash
    npm start
    ```
    > The application will automatically open in your browser at `http://localhost:3000`.
***

Video >
[![Watch Demo on Loom]](https://www.loom.com/share/3556cc16ec744fa186738eaefdb573ea)
