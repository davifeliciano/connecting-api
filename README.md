# connecting-api

https://github.com/davifeliciano/connecting-api/assets/26972046/386ddf5b-edd1-49c1-8b3b-23dcee79b261

Backend for a simple picture based social network featuring likes, followers,
comments and hashtags functionality. Images are automatically resized to a
pre-configured resolution — blurred inline margins are generated, if necessary —
and stored in a AWS S3 bucket.

## Usage

1. Setup an PostgreSQL database and an AWS S3 bucket
2. Create a `.env` file from `.env.example` and fill out the values
   corresponding to the created database and bucket
3. Install the dependencies with
   ```bash
   $ npm install
   ``````
4. Run the migrations with
   ```bash
   $ npm run migrate up
   ```
5. Run the development server with
   ```bash
   $ npm run dev
   ```

## Roadmap

- [ ] Auth
  - [X] Access and refresh token authentication
  - [ ] Role based authentication
  - [ ] Github authentication
  - [ ] Password reset
- [X] Users
  - [X] Profile update
- [ ] Posts
  - [X] Post creation
  - [ ] Post deletion
- [x] Upvote system
- [x] Followers system
- [ ] Comments system
- [ ] Hashtags system
- [ ] Documentation
- [ ] Tests
