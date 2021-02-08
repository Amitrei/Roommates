export const fromClient = (clientTransObj, user, roomId = null) => {
  return Object.freeze({
    roomId,
    madeBy: user._id,
    amount: clientTransObj.amount,
    category: clientTransObj.category,
    date: new Date(),
  });
};
