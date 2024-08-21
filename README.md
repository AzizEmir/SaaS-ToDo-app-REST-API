# SaaS To-Do App REST API

A REST API for user management (authorization and authentication) and task management.

## Getting Started

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file with the following content:
```env
PORT=3000
MONGODBURI=mongodb://<IP>:27017/jwt-tutorial
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### User Registration
**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
    "firstName": "Test2",
    "lastName": "Testt2",
    "email": "test2@test2.xyz",
    "password": "123"
}
```

**Response:**
```json
{
    "data": {
        "firstName": "Test2",
        "lastName": "Testt2",
        "email": "test2@test2.xyz",
        "password": "$2a$10$bHPqcGZR1MUwcbfFUa94ZuWU4PtLwdv/wXNcH5Lc4ljaJJhWlUK9e",
        "isAdmin": false,
        "_id": "66c5c2a7c77f27d4b399f8ea",
        "id": "1ef5fa8e-a08b-6b80-b727-34ade614f982",
        "createdDate": "2024-08-21T10:34:15.736Z",
        "__v": 0
    },
    "error": null
}
```

### User Login
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
    "email": "test2@test2.xyz",
    "password": "123"
}
```

**Response:**
```json
{
    "data": {
        "token": "your_jwt_token_here"
    },
    "error": null
}
```

### Change Password
**Endpoint:** `PATCH /api/change-password`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
    "email": "test2@test2.xyz",
    "currentPassword": "123",
    "newPassword": "12345"
}
```

**Response:**
```json
{
    "data": "Password reset successful",
    "error": null
}
```

### Get All Users (Admin Only)
**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
    "data": [/* list of users */],
    "error": null
}
```

### Delete Users (Admin Only)
**Endpoint:** `DELETE /api/users`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
    "ids": [
        "1ef5fa8e-a08b-6b80-b727-34ade614f982",
        "1ef5fa8e-39ae-6b60-b8be-893f9225347c"
    ]
}
```

**Response:**
```json
{
    "data": {
        "deletedCount": 2
    },
    "error": null
}
```

### Create Task
**Endpoint:** `POST /api/tasks`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
    "title": "Sample Task",
    "description": "This is a sample task description."
}
```

**Response:**
```json
{
    "data": {
        "title": "Sample Task",
        "description": "This is a sample task description.",
        "userId": "66c5b8f585891d379b82fcc2",
        "_id": "66c5d601d650b34d9876c3e5",
        "id": "1ef5fb47-2ae9-6210-92da-0498ecef85c0",
        "createdDate": "2024-08-21T11:56:49.457Z",
        "__v": 0
    },
    "error": null
}
```

### Get All Tasks
**Endpoint:** `GET /api/tasks`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
    "data": [
        {
            "_id": "66c5ce23de0eca361019f444",
            "title": "Sample Task",
            "description": "This is a sample task description.",
            "userId": "66c5b8f585891d379b82fcc2",
            "id": "1ef5fafc-25e4-6c10-a8ca-ae196bf9bee0",
            "createdDate": "2024-08-21T11:23:15.665Z",
            "__v": 0
        },
        {
            "_id": "66c5d274339dc9a71b965757",
            "title": "Sample Task",
            "description": "This is a sample task description.",
            "userId": "66c5b8f585891d379b82fcc2",
            "id": "1ef5fb25-4b80-6c20-a27c-fc01db6b8195",
            "createdDate": "2024-08-21T11:41:40.194Z",
            "__v": 0
        }
    ],
    "error": null
}
```

### Delete Task
**Endpoint:** `DELETE /api/tasks`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body:**
```json
{
    "ids": [
        "1ef5fb47-2ae9-6210-92da-0498ecef85c0"
    ]
}
```

**Response:**
```json
{
    "data": {
        "deletedCount": 1
    },
    "error": null
}
```