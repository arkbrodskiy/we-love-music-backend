const db = require("../db/connection");

const tableName = "movies";

async function list(is_showing) {
  return db(tableName)
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db(tableName)
      .select("*")
      .where({"movie_id": movie_id})
      .first()
}

module.exports = {
  list,
  read,
};
