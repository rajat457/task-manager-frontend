
# Task Manager Frontend

The frontend for the Task Manager application, built using Next.js. This frontend allows users to manage their tasks, including creating, updating, and deleting tasks, as well as user authentication features.

## Live Demo
You can view the live demo of the application here:
[Live Demo Link](https://task-manager-frontend-seven-blush.vercel.app/)

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
- A Supabase project (for authentication and database)

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

## Registering a User
To register a user, follow these steps:

1.  Navigate to the registration page (/register).
2.  Provide a valid email and password.
3.  Click Register to submit the form.
4.  If the registration is successful, you will be redirected to the Login page.

### Example:

- **Email**: example@domain.com
- **Password**: password123

## Logging In a User
To log in an existing user:

1.  Navigate to the login page (/login).
2.  Provide your email and password.
3.  Click Login to authenticate the user.

If the login is successful, you will be redirected to the Dashboard page.

## Task Management

Once logged in, users can manage tasks. Here's how you can:

### Adding a Task

1.  Navigate to the Dashboard page.
2.  Click the Create Task button.
3.  Fill in the task details:
    - **Title**: A short description of the task
    - **Description**: A more detailed description of the task
    - **Due Date**: Select a date when the task should be completed
    - **Priority**: Choose from Low, Medium, or High priority
    - **Status**: Set the task status to To Do, In Progress, or Done
    - **Assign to**: Choose a user to assign the task to
4.  After filling out the form, click **Create Task** to save the task.

### Example:
- **Title**: Complete project report
- **Description**: Write the final report for the project.
- **Due Date**: 2025-05-10
- **Priority**: Medium
- **Status**: To Do
- **Assign to**: John Doe

### Modifying a Task

To modify a task:

1.  Navigate to the Dashboard page.
2.  Click on the task you want to modify.
3.  Update the necessary fields.
4.  Click Save to save the changes.

### Example:
- Change **Priority** from **Medium** to **High**.
- Change **Status** from **To Do** to **In Progress**.

### Deleting a Task

To delete a task:

1.  Navigate to the Dashboard page.
2.  Click on the task you want to delete.
3.  Click the Delete button to remove the task.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
