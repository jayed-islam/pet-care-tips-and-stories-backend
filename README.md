# Eyebook Backend

This is the **backend server** for the **Eyebook** project, a social platform dedicated to pet care and stories. The backend is built with Node.js, Express, and MongoDB, handling all API requests, user authentication, and data storage.

[Live URL](https://eyebook-server.vercel.app 'Visit the live server')

# Admin Credentials

To log in as an admin, use the following credentials:

- **Email**: `eyebook-admin@gmail.com`
- **Password**: `password`

```json
{
  "email": "eyebook-admin@gmail.com",
  "password": "password"
}
```

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Best Practices](#best-practices)
- [Environment Variables](#environment-variables)
- [Installation Guide](#installation-guide)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Project Overview

The Eyebook backend server is responsible for managing users, posts, roles, followers, and the overall interaction between users on the platform. It uses RESTful APIs to communicate with the frontend, allowing users to create profiles, follow others, share pet stories, and much more.

## Technologies Used

- **Node.js** - Server runtime
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for storing user and post data
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **JWT (JSON Web Tokens)** - Used for secure user authentication
- **bcryptjs** - Password hashing for security
- **TypeScript** - Type safety and improved developer experience

## Best Practices

The backend follows several best practices to ensure performance, security, and maintainability:

### 1. **Modular Architecture**

- Code is divided into modules with separate concerns for controllers, services, models, and routes to ensure scalability and ease of maintenance.

### 2. **Type Safety with TypeScript**

- Using TypeScript ensures the prevention of type-related bugs and makes the code more maintainable and easier to refactor.

### 3. **JWT Authentication**

- The server uses JWT tokens to handle user authentication securely. Only authenticated users can perform specific actions like posting stories or following others.

### 4. **Password Hashing**

- User passwords are hashed using `bcryptjs` to enhance security.

### 5. **Error Handling**

- The server implements centralized error handling middleware for consistent error messages and easier debugging.

### 6. **Environment Variable Configuration**

- Sensitive information such as database credentials and JWT secrets are stored in environment variables.

## Environment Variables

The backend requires specific environment variables to run. Below is the list of variables you need to define in a `.env` file:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/eyebook_db

# JWT Secret
JWT_SECRET=your_jwt_secret

# Other environment variables
NODE_ENV=development
```
