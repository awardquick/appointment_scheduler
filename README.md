# Appointment Scheduling API

## Overview

This project is an appointment scheduling system that allows providers to set their availability and clients to book appointments. The system ensures that appointments can only be made in advance, reservations expire if not confirmed, and time slots are handled in UTC.

## Features

- **Provider Availability:** Providers can set their working hours.
- **Appointment Slots:** Clients can view available appointment slots.
- **Reservation System:** Clients can reserve appointment slots.
- **Confirmation and Expiration:** Reservations expire after 30 minutes if not confirmed, and reservations must be made at least 24 hours in advance.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL or another supported database
- Redis (for background job processing)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/appointment-scheduler.git
   cd appointment-scheduler
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   REDIS_URL=redis://localhost:6379
   ```

4. **Run Migrations:**

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Seed the Database:**

   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Start the Server:**
   ```bash
   npm start
   ```

## API Endpoints

### Create Schedule

- **Endpoint:** `POST /api/schedules`
- **Request Body:**
  ```json
  {
    "providerId": "provider-uuid",
    "startTime": "2024-09-05T09:00:00Z",
    "endTime": "2024-09-05T17:00:00Z"
  }
  ```

### Reserve Slot

- **Endpoint:** `POST /api/appointments/:slotId/reserve`
- **Request Body:**
  ```json
  {
    "clientId": "client-uuid",
    "reservationTime": "2024-09-05T10:00:00Z"
  }
  ```

### Confirm Reservation

- **Endpoint:** `POST /api/appointments/:appointmentId/confirm`
- **Request Body:**
  ```json
  {
    "confirmed": true
  }
  ```

## Background Jobs

The system uses background jobs to handle the expiration of unconfirmed reservations. To ensure these jobs are processed:

1. **Install Redis:** Follow the [Redis installation guide](https://redis.io/download).
2. **Start Redis Server:**

   ```bash
   redis-server
   ```

3. **Run Background Jobs:**
   ```bash
   npm run jobs
   ```

## Trade-Offs and Design Decisions

### 1. Normalization of Time Slots

**Trade-Off:**

- **Consistency vs. Flexibility:** By setting appointment slots to 15-minute intervals, we ensure everyone is on the same page, but it might not fit every provider’s preferred timing.

**Implications:**

- **Consistency:** This approach keeps things uniform, making it easier to handle and search for available slots.
- **Provider Preferences:** Providers might have to tweak their schedules to align with these intervals, which might not be ideal for everyone.

**Decision-Making:**

- **Chosen Approach:** I decided on 15-minute intervals to streamline scheduling and create a standard system for everyone. It might limit some flexibility, but it simplifies the overall process and makes managing appointments more straightforward.

---

### 2. UTC Handling for Time Slots

**Trade-Off:**

- **Uniformity vs. Local Time Confusion:** Storing all times in UTC helps avoid time zone issues but means we need to handle time conversions on the frontend.

**Implications:**

- **Simplicity in Storage:** Keeping everything in UTC simplifies things on the backend and avoids the messiness of different time zones.
- **User Experience:** We would need to be careful with how we present these times to users, ensuring they see the right time for their own time zones.

**Decision-Making:**

- **Chosen Approach:** Storing times in UTC was chosen to keep backend operations simple. However, we would need to carefully manage time conversions on the frontend to ensure a smooth user experience.

---

### 3. Appointment Expiration and Confirmation

**Trade-Off:**

- **Automatic Management vs. Complexity:** We need to manage appointment expirations and confirmations efficiently, which means implementing a system to handle this can add complexity.

**Decision-Making:**

- **Bull Background Job vs. Serverless Function:**

  - **Bull Background Job:**

    - **Pros:**
      - **Fits Well with Existing Setup:** Bull works well with Node.js and Redis, which we’re already using.
      - **Customizable:** Offers control over job scheduling, retry strategies, and prioritization, which is useful for handling high volumes.
      - **Cost-Efficient:** Leverages existing infrastructure, potentially saving costs.
    - **Cons:**
      - **Server Dependency:** Requires a running server and Redis, adding to our operational overhead.
      - **Scalability Concerns:** As we scale, managing job queues might become a bottleneck if not optimized.

  - **Serverless Function:**
    - **Pros:**
      - **Scalable:** Automatically handles scaling with demand, no need for manual intervention.
      - **Less Maintenance:** No need for dedicated servers or job queues; the serverless provider handles this.
    - **Cons:**
      - **Potentially Higher Costs:** Frequent executions or large-scale data processing could be more expensive.
      - **Integration Complexity:** Requires careful handling of serverless infrastructure and retries.

**Implications:**

- **Resource Efficiency:** Bull background jobs integrate well with our current setup and are effective for high-frequency tasks.
- **Implementation Complexity:** While it’s a robust solution, it involves maintaining server infrastructure. Serverless functions could be considered in the future if our needs change.

**Chosen Approach:**

- I chose Bull background jobs to handle appointment expirations due to its compatibility with the existing setup and its customizable features. We would need to keep an eye on how it scales and may consider serverless options if needed.

---

### 4. Separation of Concerns

**Trade-Off:**

- **Modularity vs. Complexity:** Making the system more modular improves code maintenance but adds layers of complexity.

**Implications:**

- **Maintainability:** Keeping concerns separate makes it easier to develop, test, and manage different parts of the system.
- **Complexity:** It introduces more components, which can make the system architecture more complex and require more coordination.

**Decision-Making:**

- **Chosen Approach:** I opted for a clear separation of concerns to enhance code maintainability and modularity. While this adds complexity, it ensures that each component focuses on its specific role, which will benefit long-term management and scalability.

---

## Improvements and Considerations

### 1. Full Test Suite

- **What I Would Do:** Use Jest and `sequelize-mock` to thoroughly test the application logic. This approach allows us to test different scenarios, including edge cases and error handling, without affecting the real database.
- **Why It Matters:** Helps ensure that the code is reliable and makes debugging easier. It also ensures that changes don’t introduce new bugs.

### 2. Date Manipulation Library

- **What I Would Do:** Use a library like `date-fns` for handling dates instead of relying on native JavaScript `Date` objects. This makes working with dates more readable and manageable.
- **Why It Matters:** Simplifies complex date calculations and reduces the chances of date-related errors in the code.

### 3. Authentication and Authorization

- **What I Would Do:** Implement JWT-based authentication to secure API endpoints. Role-based access control (RBAC) can manage permissions based on user roles (e.g., providers vs. clients).
- **Why It Matters:** Improves security by controlling access to protected routes and verifying user identities.

### 4. Error Handling and Logging

- **What I Would Do:** Set up robust error handling and logging using tools like `winston` or `bunyan`. This helps in tracking issues and monitoring the application's health.
- **Why It Matters:** Provides better insights into the application’s behavior and aids in troubleshooting and maintaining system stability.

### 5. API Rate Limiting

- **What I Would Do:** Implement rate limiting with tools like `express-rate-limit` to protect the API from misuse and ensure fair usage.
- **Why It Matters:** Helps prevent abuse and safeguards against potential denial-of-service attacks by limiting the number of requests a client can make.

### 6. Pagination and Filtering

- **What I Would Do:** Add pagination and filtering to endpoints that return large lists of data, such as available slots or user appointments.
- **Why It Matters:** Improves performance and usability by managing large datasets and reducing response sizes.

### 7. Documentation and API Specification

- **What I Would Do:** Use tools like Swagger/OpenAPI to document the API and validate schemas. This provides clear, interactive API documentation and ensures the API meets specified standards.
- **Why It Matters:** Enhances the developer experience, supports client-side integration, and serves as a reference for maintaining API standards.

### 8. Scalability Considerations

- **What I Would Do:** As the app grows, consider optimizing for scalability with database indexing, load balancing, and caching strategies (e.g., Redis).
- **Why It Matters:** Helps the application handle increased load and maintain performance as the user base and data volume expand.

## Testing

1. **Run Tests:**
   ```bash
   npm test
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


```

```
