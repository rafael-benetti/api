export default {
  jwt: {
    secret: (process.env.APP_SECRET || undefined) as string,
    expiresIn: '1d',
  },
};
