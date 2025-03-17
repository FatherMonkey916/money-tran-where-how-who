# Foco Chat Your Money

A Next.js application for financial chat assistance and management.

## Overview

Foco Chat Your Money is a web application that helps users manage their finances through an interactive chat interface. The application leverages AI technology to provide personalized financial advice and management tools.

## Features

- AI-powered financial chat assistant
- User authentication and account management
- Financial data visualization with Recharts
- Payment processing with PayPal and Stripe
- Responsive UI built with Radix UI components
- Dark/light theme support

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Express
- **Database**: MongoDB, Prisma
- **Authentication**: JWT, bcrypt
- **Payment Processing**: Stripe, PayPal
- **UI Components**: Radix UI, shadcn/ui
- **Form Handling**: React Hook Form, Zod validation
- **AI Integration**: OpenAI

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/doyourbest96/foco-chat-your-money.git
```

2. Navigate to the project directory:

```bash
cd foco-chat-your-money
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

5. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

- `/app` - Next.js app router components and pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared code
- `/prisma` - Prisma schema and migrations
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Project Link: [https://github.com/doyourbest96/foco-chat-your-money](https://github.com/doyourbest96/foco-chat-your-money)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [MongoDB](https://www.mongodb.com/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
