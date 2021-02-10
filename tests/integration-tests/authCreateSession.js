export default (agent) => {
  return Object.freeze({
    login: async () => {
      return await agent.get("http://localhost:3002/api/test/auth/");
    },
    getUser: async () => await agent.get("http://localhost:3002/api/test/auth/user"),
  });
};
