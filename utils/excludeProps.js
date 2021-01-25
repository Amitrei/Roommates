export default (object, ...props) => {
  const excludedObject = { ...object };
  props.forEach((prop) => {
    if (excludedObject[prop]) {
      delete excludedObject[prop];
    }
  });

  return Object.freeze(excludedObject);
};
