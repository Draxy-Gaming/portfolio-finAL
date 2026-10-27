export const authenticateAdmin = (req, res, next) => {
  const providedSecret = req.headers['x-admin-secret'];
  const adminSecret = process.env.ADMIN_SECRET || 'dev-secret'; // Provide default for development testing
  if (providedSecret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
