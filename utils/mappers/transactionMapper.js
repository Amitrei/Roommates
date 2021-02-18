export const fromClient = (clientTransObj, user, roomId = null) => {
  return {
    roomId,
    madeBy: user._id.toString(),
    amount: clientTransObj.amount,
    category: clientTransObj.category,
  };
};
