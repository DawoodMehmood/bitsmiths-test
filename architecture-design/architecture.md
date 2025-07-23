# Architecture for Recipe Sharing Platform

##  1. Tech Stack

### Frontend

- Framework: Nextjs
- Styling: TailwindCSS
- Image Upload: AWS S3 or Firebase Storage

### Backend

- Framework: Nodejs with Express (or Nextjs API routes if monolithic)
- Authentication: JWT or NextAuth
- Notifications: Socket.io

### Database

- Primary DB: PostgreSQL
- ORM: Prisma ORM
- Search: PostgreSQL Full Text Search or ElasticSearch
- Caching: Redis

### Other Services

- File Storage: AWS S3 or Firebase Storage (for images) or CDN
- CI/CD & Hosting: Vercel
- Email Service: AWS SES


##  2. System Architecture Diagram

![Architecture](/architecture-design/architecture.png)


##  3. Database Schema

![ERD Diagram](/architecture-design/erd.png)

### Index Suggestions:

- Composite index on `recipe_id, created_at` in comments/likes for fast feed.
- Full text index on `recipes.title`, `ingredients`, and `steps`.
- Index on `user_id` in recipes, likes, saved_recipes, and notifications.


##  4. Data Flow (Typical Request)

1. User Posts Recipe

   - Frontend sends `POST /recipes` with form data
   - Backend verifies auth, stores recipe (initially as draft)
   - If image included, it's uploaded to s3/firebase → URL stored in DB

2. User Likes Recipe

   - `POST /recipes/:id/like`
   - Backend creates like record → publishes notification to Redis
   - Notification service pushes via Socket.io → updates user's client

3. Recipe Feed

   - `GET /feed?sort=trending|recent`
   - Backend fetches recipes using Prisma + Redis cache (for trending)

4. Search

   - `GET /search?q=chicken&category=vegan`
   - Postgres FTS or ElasticSearch for filtering


##  5. Scalability Plan

### Database Scaling:

- Start with vertical scaling on PostgreSQL
- Use Redis for caching frequently accessed recipes & feed
- Use Load Balancer for distributing read requests

### Asset Handling:

- Use CDN for static assets and images

### Notifications:

- Redis Pub/Sub for realtime delivery

### Search

- Use ElasticSearch for filtering/sorting large datasets
  

##  6. Performance Optimization

### Feed Loading

- Infinite scroll with pagination
- Cache most liked/trending feeds in Redis
- Use skeleton loaders for better perceived speed

### Image Handling

- Lazy load images
