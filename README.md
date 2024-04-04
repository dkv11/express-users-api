# Express Users API

## Description

This project is a RESTful API developed with Express.js. It's designed to manage user data, providing basic CRUD (Create, Read, Update, Delete) operations.
The data is stored in a JSON file, making it a lightweight solution for user management without the need for external databases.

## Features

- List all users
- Retrieve a single user by ID
- Add a new user
- Update user information
- Delete a user

## Technologies Used

- Node.js
- Express.js
- JSON for data storage

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed on your machine. To check if you have Node.js installed, run the following command in your terminal:

###bash
node --version
npm --version

###Usage
Here are some examples of how to use the API:

List All Users: GET /api/users
Retrieve a Single User by ID: GET /api/users/:id
Add a New User: POST /api/users with user data as JSON in the request body.
Update User Information: PATCH /api/users/:id with the updated data as JSON in the request body.
Delete a User: DELETE /api/users/:id

