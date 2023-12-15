const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const tableName = "reviews";

function generateCriticObject() {
  return mapProperties({
    "c_critic_id": "critic.critic_id",
    "c_created_at": "critic.created_at",
    "c_updated_at": "critic.updated_at",
    "preferred_name": "critic.preferred_name",
    "surname": "critic.surname",
    "organization_name": "critic.organization_name",
  })
}

async function destroy(review_id) {
  return db(tableName).where({ review_id }).del();
}

async function list(movie_id) {
  return db(tableName)
      .join("critics", "reviews.critic_id", "critics.critic_id")
      .select("reviews.*",
          "critics.critic_id as c_critic_id",
          "critics.created_at as c_created_at",
          "critics.updated_at as c_updated_at",
          "critics.preferred_name",
          "critics.organization_name",
          "critics.surname")
      .where({"reviews.movie_id" : movie_id})
      .then(dataArr => dataArr.map(generateCriticObject()))
}

async function read(reviewId) {
  return db(tableName)
      .select(`${tableName}.*`)
      .where({"review_id": reviewId})
      .first()
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
