/* eslint-disable react/prop-types */

const ArrayValidator = ({ list = [], children, fallback }) => {
  if (Array.isArray(list) && list.length > 0) return children;
  return fallback || null;
};

export default ArrayValidator;
