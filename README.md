# Road Quest

Road Quest is a full-stack web application dedicated to providing a seamless car rental experience. Users can easily browse, book, and manage car rentals through a modern and user-friendly interface built with React and a robust Node.js/Express backend.

**Live Site URL:** [**https://road-quest-client.vercel.app/**](https://road-quest-client.vercel.app/)

---

## Key Features

-   **User Authentication:** Secure user registration and login system using **Firebase** authentication.
-   **Car Rental Booking:** Users can browse a fleet of vehicles, view details, and book a car for their desired dates.
-   **Interactive Dashboard:** A personalized user dashboard to view and manage current and past car rental bookings.
-   **Dynamic Search and Filtering:** Easily find the perfect vehicle with intuitive search and filtering options.
-   **Responsive Design:** A mobile-first design that ensures a seamless experience across all devices.
-   **Admin Capabilities:** A dedicated interface for administrators to manage the vehicle fleet, bookings, and users.
-   **Interactive Charts:** Data visualization on the dashboard using `recharts` to provide rental insights to users.
-   **Toast Notifications:** User-friendly feedback for actions like confirming a booking or updating a profile.

---

## Technologies Used

This project is built with a modern **MERN-like stack** (MongoDB, Express, React, Node.js) and utilizes various libraries and frameworks.

### Frontend

| Dependency | Description |
| :--- | :--- |
| **[React](https://react.dev/)** | A JavaScript library for building user interfaces. |
| **[React Router](https://reactrouter.com/)** | Declarative routing for React applications. |
| **[Vite](https://vitejs.dev/)** | A next-generation frontend build tool for fast development. |
| **[Tailwind CSS](https://tailwindcss.com/)** | A utility-first CSS framework for rapid UI development. |
| **[Axios](https://axios-http.com/)** | A promise-based HTTP client for making requests to the backend. |
| **[Firebase](https://firebase.google.com/)** | Used for user authentication and hosting. |
| **[Recharts](https://recharts.org/)**| A composable charting library built on React components. |
| **[React Icons](https://react-icons.github.io/react-icons/)**| A rich library of SVG icons for React projects. |

### Backend

| Dependency | Description |
| :--- | :--- |
| **[Node.js](https://nodejs.org/)** | A JavaScript runtime environment for the server-side. |
| **[Express.js](https://expressjs.com/)** | A minimal and flexible Node.js web application framework. |
| **[MongoDB](https://www.mongodb.com/)** | A NoSQL database used for storing application data. |
| **[JSON Web Token (JWT)](https://jwt.io/)** | For creating secure access tokens for authentication. |
| **[CORS](https://www.npmjs.com/package/cors)** | Middleware for enabling Cross-Origin Resource Sharing. |
| **[dotenv](https://www.npmjs.com/package/dotenv)** | For managing environment variables. |
| **[Cookie-Parser](https://www.npmjs.com/package/cookie-parser)** | Middleware to parse cookie headers. |

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js installed on your machine (v18.x or later recommended).
-   A package manager like `npm` or `yarn`.
-   A MongoDB database instance (local or cloud-based).

### Installation

1.  **Clone the Frontend Repository:**
    ```sh
    git clone [https://github.com/fahmidurshanto/road-quest-clients.git](https://github.com/fahmidurshanto/road-quest-clients.git)
    cd road-quest-clients
    ```
2.  **Install Frontend Dependencies:**
    ```sh
    npm install
    ```
3.  **Clone the Backend Repository:**
    ```sh
    git clone [https://github.com/fahmidurshanto/road-quest-server.git](https://github.com/fahmidurshanto/road-quest-server.git)
    cd road-quest-server
    ```
4.  **Install Backend Dependencies:**
    ```sh
    npm install
    ```
5.  **Set up Environment Variables:**
    -   In the `road-quest-server` directory, create a `.env` file and add the necessary environment variables (e.g., MongoDB connection string, JWT secret).
    -   In the `road-quest-clients` directory, configure your Firebase credentials, typically in a `.env.local` file.

6.  **Run the Development Servers:**
    -   For the backend (`road-quest-server`):
        ```sh
        npm start
        ```
    -   For the frontend (`road-quest-clients`):
        ```sh
        npm run dev
        ```