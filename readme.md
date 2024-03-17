# Container Terminal Management System

This Node.js application is designed to manage containers at a container terminal, allowing users to easily handle their daily operations and book containers efficiently.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization system.
- Container management (add, update, delete containers).
- Booking system for containers.
- Dashboard for monitoring daily flows and statistics.
- RESTful API endpoints for integration with other systems.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- Other dependencies listed in `package.json`

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database (local or cloud-based).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Fleet-Queue/container_terminal_backend

2. Navigate to the project directory:

   ```bash
   cd container-terminal-management

3. Install dependencies
   ```bash
   npm install

### Configuration
Create a .env file in the root directory:
   ```bash
   PORT=5000
   MONGODBURI=''
   JWT_SECRET=''

5. Start the development server:  
    ```bash
    npm start

The server should start running on http://localhost:3000.

## Usage

- Register/login as a user to access the application functionalities.
- Manage containers (add, update, delete).
- Book containers for specific tasks or shipments.
- Monitor daily flows and statistics on the dashboard.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
