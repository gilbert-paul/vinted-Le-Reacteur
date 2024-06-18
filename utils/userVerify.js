/**
 *
 * @param {Object} user
 * @returns {Array}
 */
const userVerify = (user) => {
  const informationsArray = [
    user.username,
    user.email,
    user.password,
    user.newsletter,
  ];
  const keysInformations = ["username", "email", "password", "newsletter"];
  const missingInformations = [];
  for (let i = 0; i < informationsArray.length; i++) {
    if (!informationsArray[i]) {
      if (missingInformations.length === 0) {
        keysInformations[i] =
          keysInformations[i].slice(0, 1).toUpperCase() +
          keysInformations[i].slice(1);
        missingInformations.push(`${keysInformations[i]}`);
      } else {
        missingInformations.push(`, ${keysInformations[i]}`);
      }
    }
  }
  return missingInformations;
};

module.exports = userVerify;
