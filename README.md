# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built with the MERN stack. It provides a shopping experience with customer authentication, product browsing, wishlist and cart management, and payment integration through Razorpay.

The application is deployed using Vercel, Render, and MongoDB Atlas.

Deployment Link : https://shopkart-xi-khaki.vercel.app/

## Features

- **User Authentication** — Customer registration, login, and logout with JWT-based authentication using HTTP-only cookies.
- **Product Browsing** — Explore products and view product information.
- **Shopping Cart** — Add products, update quantities, and remove items.
- **Wishlist** — Save products and manage your wishlist.
- **Checkout & Payments** — Create payment orders and integrate Razorpay checkout.
- **Payment Verification** — Verify Razorpay payment signatures on the backend before completing the order flow.
- **Order Management** — Create and retrieve customer orders.
- **REST API** — Organized Express routes, controllers, models, and authentication middleware.
- **Production Deployment** — Separate frontend and backend deployments with a cloud-hosted MongoDB database.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, HTTP-only cookies |
| Payments | Razorpay |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## Architecture

ShopKart follows a client-server architecture.

1. The React frontend provides the shopping interface.
2. Axios communicates with the Express REST API.
3. The backend handles authentication, business logic, and database operations.
4. MongoDB stores application data.
5. Razorpay handles payment checkout, while the backend verifies payment signatures.

```text
                    ShopKart
                       |
             +---------+---------+
             |                   |
       React + Vite         Express API
          (Vercel)            (Render)
                                  |
                       +----------+----------+
                       |                     |
                   MongoDB Atlas          Razorpay
                   Application DB       Payment Gateway
```


## Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   └── ...
│       ├── package.json
│       └── vercel.json
│
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- Razorpay account and API keys for testing payments

### 1. Clone the Repository

```bash
git clone https://github.com/Krish2725/ShopKart.git
cd ShopKart
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=8081
NODE_ENV=development
dbURL=your_mongodb_connection_string
jwt_secret=your_jwt_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the placeholder values with your own credentials. Ensure that the MongoDB connection string points to your database.

Start the backend:

```bash
npm start
```

The backend runs on `http://localhost:8081` by default.

Health endpoint: `http://localhost:8081/health`

Readiness endpoint: `http://localhost:8081/ready`

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend/vite-project
npm install
```

Create a `.env` file inside `frontend/vite-project`:

```env
VITE_API_URL=http://localhost:8081
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Test the Application

1. Register a customer account and log in.
2. Browse products and add an item to the cart.
3. Add or remove products from the wishlist.
4. Update cart quantities and proceed to checkout.
5. Test the payment flow using Razorpay test credentials.
6. Verify that orders and cart state behave as expected.

## Deployment

ShopKart is deployed using the following services:

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | MongoDB Atlas |
| Payment Integration | Razorpay |

### Production Configuration

Configure the following environment variables in the respective hosting dashboards.

**Render — Backend**

- `dbURL` — MongoDB Atlas connection string
- `jwt_secret` — Strong JWT signing secret
- `NODE_ENV` — `production`
- `CLIENT_URL` — Exact deployed frontend origin
- `RAZORPAY_KEY_ID` — Razorpay API key ID
- `RAZORPAY_KEY_SECRET` — Razorpay API secret

Render provides the `PORT` environment variable for the running service.

**Vercel — Frontend**

- `VITE_API_URL` — Deployed backend base URL

After changing frontend environment variables, rebuild and redeploy the frontend. Ensure the backend's `CLIENT_URL` matches the actual frontend origin so credentialed cross-origin requests can work.

## Security Considerations

- Keep `.env` files and secret credentials out of version control.
- Use strong, unique secrets for JWT signing and database authentication.
- Keep Razorpay secret keys on the backend; never expose them through frontend environment variables.
- Verify payment signatures on the server before treating a payment as successful.
- Use HTTPS and secure cookie settings in production.
- Restrict database access and grant only the permissions required by the application.

## Future Improvements

- Automated unit and integration testing
- Improved product filtering, sorting, and pagination
- Order status and order history enhancements
- Better loading, error, and empty states
- Accessibility and responsive UI refinements

## Author

**Krishna Singh**

GitHub: [@Krish2725](https://github.com/Krish2725)

---

*Built as a full-stack web development project to practise frontend development, REST API design, database integration, authentication, payment processing, and deployment.*
