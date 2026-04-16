export const createResponse = (success, data = null, message = null) => {
  const response = { success };
  if (data) response.data = data;
  if (message) response.message = message;
  return response;
};

export const handleError = (error) => {
  console.error('Error:', error);
  return {
    success: false,
    message: error.message || 'An error occurred'
  };
};

export const paginate = (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
