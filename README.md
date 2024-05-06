# Subscription Tracker/Reminder

This project is a subscription tracker and reminder application built using Next.js with TypeScript, Supabase, and Vercel.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Upcoming Features](#upcoming-features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Subscription Tracker/Reminder is a web application designed to help users keep track of their monthly or yearly subscriptions. Users can add their subscriptions, view details, and receive reminders for upcoming payments.

The application supports both authenticated and non-authenticated modes. In the non-authenticated mode, users can add subscriptions without logging in, and the data will be saved in the browser. Users can later sync this data after signing up or logging in.

## Features

- **Add Subscriptions**: Users can add all their subscriptions, specifying whether they are monthly or yearly.
- **Authentication**: Supports both authenticated and non-authenticated modes.
- **Sync Data**: Non-authenticated users can later sync their subscriptions after signing up or logging in.
- **View Subscriptions**: Users can view details of their subscriptions, including payment dates and amounts.

## Upcoming Features

- **Reminder Emails**: Users will receive reminder emails when the next payment for a subscription is due.
- **Import Subscriptions**: Users will be able to import subscriptions from their credit card statements.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
    `git clone https://github.com/your-username/subscription-tracker.git`


2. Install dependencies:
    `cd subscription-tracker`
    `npm install`


3. Set up Supabase:
   - Create an account on Supabase (https://supabase.io/).
   - Create a new project and note down the URL and API key.

4. Configure environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
    `NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL`
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`


5. Run the development server:
    `npm run dev`


6. Open http://localhost:3000 in your browser.

## Usage

Once the application is running, users can:

- Add subscriptions by clicking on the "+" button and filling in the details.
- View existing subscriptions on the dashboard.
- Sign up or log in to sync data across devices and receive reminder emails (upcoming feature).

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/my-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
