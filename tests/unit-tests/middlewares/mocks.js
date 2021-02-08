export const next = jest.fn();
export const req = { user: { id: 1, name: "mockedUser" }, params: { roomId: 1 } };
export const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
