jest.mock(".", () => {
    return {
      __esModule: true,
      prisma: jestPrisma.client,
    };
  });