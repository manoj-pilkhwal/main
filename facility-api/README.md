# Facility API

This is a Node.js Express API project for managing facilities. It allows users to retrieve facility details by ID and create new facilities with associated phone numbers.

## Project Structure

```
facility-api/
├── src/
│   ├── controllers/
│   │   └── facilityController.js
│   ├── models/
│   │   └── facility.js
│   ├── routes/
│   │   └── facilityRoutes.js
│   └── app.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd facility-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run:
```
npm start
```

The server will run on `http://localhost:3000`.

## API Endpoints

### GET /facility/:id

Retrieve facility details by ID.

**Parameters:**
- `id`: The ID of the facility.

### POST /facility

Create a new facility.

**Request Body:**
```json
{
  "id": "string",
  "phoneNumber": "string"
}
```

**Response:**
- Returns the created facility object.

## License

This project is licensed under the MIT License.