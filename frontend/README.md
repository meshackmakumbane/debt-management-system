# DebtHero Frontend

A modern debt collection and management platform built with React. The application provides dedicated dashboards for administrators, agents, and debtors, enabling efficient debt tracking, payment management, and communication.

## Features

* Secure authentication and authorization
* Role-based access control
* Admin dashboard
* Agent dashboard
* Debtor management
* Debt tracking and monitoring
* Payment history management
* Ticket and support system
* Responsive user interface
* Real-time dashboard metrics

## Tech Stack

* React
* React Router DOM
* Redux Toolkit
* Axios
* Tailwind CSS
* React Icons

## Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

npm install

### Environment Variables

Create a `.env` file in the root of the client directory:

VITE_API_URL=http://localhost:5000/api

Adjust the API URL according to your backend configuration.

### Running the Application

Start the development server:

npm run dev

The application will be available at:

http://localhost:5173

## Project Structure

src/
├── api/
├── app/
├── assets/
├── components/
├── features/
├── middleware/
├── layouts/
├── pages/
├── routes/
├── utils/
└── App.jsx

## User Roles

### Administrator

* Manage users
* Manage agents
* Manage debtors
* View reports and analytics
* Manage tickets and support requests

### Agent

* View assigned debtors
* Manage collections
* Update debtor information
* Submit support tickets
* Track payment progress

### Debtor

* View debt information
* Track payment history
* Submit support tickets
* Upload supporting documents

## Build for Production

Generate a production build:

npm run build

Preview the production build:

npm run preview

## Future Enhancements

* Real-time notifications
* Advanced reporting
* Payment gateway integration
* Cloud file storage
* Audit logs
* Performance monitoring

## License

This project is developed for educational, portfolio, and commercial use.