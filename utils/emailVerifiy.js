/**
 *
 * @param {string} email
 * @returns {boolean}
 */
const emailVerify = (email) => {
  const emailArray = email.split("");
  if (
    emailArray.indexOf("@") > 0 &&
    emailArray.indexOf(".") > emailArray.indexOf("@") + 1 &&
    emailArray.indexOf(".") < emailArray.length - 1
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = emailVerify;
