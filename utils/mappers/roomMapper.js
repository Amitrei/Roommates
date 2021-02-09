export const toClient = (roomObj) => {
  return Object.freeze({
    name: roomObj.name,
  });
};
