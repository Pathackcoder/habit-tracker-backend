// Helper validation functions

exports.isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

exports.isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};


