const cuid = require("cuid");

const randomString = Object.freeze({
  create: cuid.slug,
  isValid: cuid.isSlug
});

module.exports = randomString;
