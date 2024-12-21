describe('Reservations', () => {
  beforeAll(async () => {
    const user = {
      email: 'testapp@mail.com',
      password: 'Test!123',
    };
    await fetch('http://auth:3001', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  });
});