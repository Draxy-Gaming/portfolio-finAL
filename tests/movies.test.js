import { test, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../server/index.js";
import db from "../server/db.js";

beforeAll(() => {
  // Setup database for tests or clear tables
});

beforeEach(() => {
  // Clear tables before each test
  db.prepare("DELETE FROM movies").run();
  db.prepare("DELETE FROM user_movie_entries").run();
});

test("Imports a new movie successfully", async () => {
  const movieData = {
    tmdb_id: 123,
    title: "Test Movie",
    original_title: "Test Movie Org",
    release_date: "2023-01-01",
    overview: "A great test movie.",
    poster_path: "/testposter.jpg",
    backdrop_path: "/testbackdrop.jpg",
    vote_average: 8.5
  };

  const response = await request(app)
    .post("/api/movies/import")
    .set("x-admin-secret", "dev-secret")
    .send(movieData);

  expect(response.status).toBe(201);
  expect(response.body.isNew).toBe(true);
  expect(response.body.movie.title).toBe("Test Movie");
  expect(response.body.entry.status).toBe("want_to_watch");
});

test("Returns existing movie if already imported", async () => {
  const movieData = {
    tmdb_id: 124,
    title: "Another Test Movie",
    original_title: "Another Test Movie Org",
    release_date: "2023-01-01"
  };

  // First import
  await request(app)
    .post("/api/movies/import")
    .set("x-admin-secret", "dev-secret")
    .send(movieData);

  // Second import
  const response = await request(app)
    .post("/api/movies/import")
    .set("x-admin-secret", "dev-secret")
    .send(movieData);

  expect(response.status).toBe(200);
  expect(response.body.isNew).toBe(false);
  expect(response.body.movie.title).toBe("Another Test Movie");
});

test("Rejects unauthorized import attempts", async () => {
  const response = await request(app)
    .post("/api/movies/import")
    .send({ tmdb_id: 999 });

  expect(response.status).toBe(401);
});
