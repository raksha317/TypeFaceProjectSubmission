# Dropbox Clone

A simple Dropbox-like file upload and download web application built with React (frontend) and Spring Boot (backend).

---

## Project Structure

dropbox-clone/
├── backend/ # Spring Boot backend
├── frontend/ # React frontend
└── README.md

yaml
Copy
Edit

---

## Features

- Upload files with restrictions on file types (`txt`, `jpg`, `png`, `json`, `pdf`, etc.)
- List all uploaded files in a table with upload timestamp
- Download files
- View supported files in a new tab
- Responsive UI with clean styling and error banners

---

## Prerequisites

- Java 17+ and Maven (for backend)
- Node.js 16+ and npm/yarn (for frontend)

---

## Setup & Run

### Backend

1. Navigate to the backend folder:

   cd dropbox-clone
Build and run the backend:

./mvnw spring-boot:run
This starts the backend server on http://localhost:8080

By default, uploaded files are stored under backend/uploads directory.

Frontend
Open a new terminal, go to frontend folder:

cd dropbox-clone
Install dependencies:

npm install
# or
yarn install
Run the React development server:

npm start
# or
yarn start
The frontend runs on http://localhost:3000 and proxies API requests to the backend.

Usage
On the home page, upload supported files using the Upload File button.

View the list of uploaded files in the table below.

Use Download to download a file.

Use View to open supported files in a new tab.

Error banners will display if any issues occur.

Configuration
You can configure the backend upload directory by modifying the uploadPath variable in FileStorageService.

Allowed file types for upload are restricted on the frontend in UploadForm component.

Troubleshooting
Make sure backend is running before starting the frontend.

If file downloads or views fail, verify the backend endpoint and filenames.

Check browser console or backend logs for detailed error info.

License
This project is licensed under the MIT License.