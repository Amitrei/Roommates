export default async (agent) => {
  return await agent.get("http://localhost:3002/api/test/auth");
};
