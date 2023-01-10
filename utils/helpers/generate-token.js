module.exports = function buildMakeToken({ randomString }) {
  return function makeToken({
    value = randomString.create(),
    expirationDate = new Date(Date.now()).getTime() + 3600 * 1000
  } = {}) {
    if (!randomString.isValid(value)) {
      throw { message: "Token value invalid" };
    }

    return Object.freeze({
      value: value.toUpperCase(),
      expirationDate
    });
  };
}
