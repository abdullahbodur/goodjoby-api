const resetPassword = (resetPasswordUrl) => {
  return `<h2> Reset Your Password </h2>
      <p> This <a href= '${resetPasswordUrl}' target='_blank'>link</a> will be expire in 1 hour </p>`;
};

const verificationMail = (resetPasswordUrl, name) => {
  return `<h2> Verification Mail </h2>
      <p>Hello ${name},\n This <a href= '${resetPasswordUrl}' target='_blank'>link</a> will be expire in 1 hour </p>`;
};

module.exports = {
  resetPassword,
  verificationMail,
};
