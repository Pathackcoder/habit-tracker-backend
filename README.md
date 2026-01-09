# Habit Tracker Backend

A RESTful API backend for a Habit Tracker application built with Node.js, Express, and MongoDB.

## Features

- 🔐 User Authentication (JWT-based)
- 📊 Habit Tracking (CRUD operations)
- 📝 Journal Entries
- 📈 Analytics & Statistics
- ⚙️ User Settings Management
- ✅ Daily Habit Completion Tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator


## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Habit-Tracker-Backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/change-password` - Change password
- `DELETE /api/v1/users/account` - Delete account

### Habits
- `GET /api/v1/habits` - Get all habits
- `POST /api/v1/habits` - Create a habit
- `GET /api/v1/habits/:id` - Get habit by ID
- `PUT /api/v1/habits/:id` - Update habit
- `DELETE /api/v1/habits/:id` - Delete habit
- `POST /api/v1/habits/:id/entries` - Toggle habit entry
- `GET /api/v1/habits/:id/entries` - Get habit entries

### Journal
- `GET /api/v1/journals` - Get all journal entries
- `POST /api/v1/journals` - Create journal entry
- `GET /api/v1/journals/:id` - Get journal entry by ID
- `PUT /api/v1/journals/:id` - Update journal entry
- `DELETE /api/v1/journals/:id` - Delete journal entry

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard stats
- `GET /api/v1/analytics/habits/:id/stats` - Get habit statistics
- `GET /api/v1/analytics/habits/:id/streak` - Get habit streak
- `GET /api/v1/analytics/monthly-report` - Get monthly report

### Settings
- `GET /api/v1/settings` - Get user settings
- `PUT /api/v1/settings` - Update user settings

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Development

The project uses nodemon for auto-restarting during development. Make sure MongoDB is running before starting the server.

## Testing

Tests are located in the `tests/` directory. Run tests using:

```bash
npm test
```

## License

ISC


