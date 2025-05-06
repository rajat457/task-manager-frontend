
# Task Manager Frontend

The frontend for the Task Manager application, built using Next.js. This frontend allows users to manage their tasks, including creating, updating, and deleting tasks, as well as user authentication features.

## Features

- **User Authentication**: Register, login, and logout using Supabase authentication.
- **Task Management**: Create, update, and delete tasks.
- **Task Priority & Status**: Set priorities (Low, Medium, High) and track task status (To Do, In Progress, Done).

## Technologies Used

- **Next.js**: React framework for building server-side rendered applications.
- **Supabase**: Open-source Firebase alternative for authentication and database.
- **Tailwind CSS**: Utility-first CSS framework for building responsive UIs.

## Installation

### Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)

### Steps to Set Up the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/rajat457/task-manager-frontend.git
   cd task-manager-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file at the root of the project with the following:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
