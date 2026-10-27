import test from 'node:test';
import assert from 'node:assert';
import { authenticateAdmin } from './auth.js';

test('authenticateAdmin', async (t) => {
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  const createRes = () => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.body = data;
      return res;
    };
    return res;
  };

  await t.test('returns 401 if no secret is provided', () => {
    nextCalled = false;
    const req = { headers: {} };
    const res = createRes();

    authenticateAdmin(req, res, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 401);
    assert.deepStrictEqual(res.body, { error: 'Unauthorized' });
  });

  await t.test('returns 401 if incorrect secret is provided', () => {
    nextCalled = false;
    const req = { headers: { 'x-admin-secret': 'wrong-secret' } };
    const res = createRes();

    authenticateAdmin(req, res, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 401);
    assert.deepStrictEqual(res.body, { error: 'Unauthorized' });
  });

  await t.test('calls next if default correct secret is provided when no env variable is set', () => {
    nextCalled = false;
    // ensure ADMIN_SECRET is not set
    const originalSecret = process.env.ADMIN_SECRET;
    delete process.env.ADMIN_SECRET;

    const req = { headers: { 'x-admin-secret': 'dev-secret' } };
    const res = createRes();

    authenticateAdmin(req, res, next);

    assert.strictEqual(nextCalled, true);

    if (originalSecret !== undefined) {
      process.env.ADMIN_SECRET = originalSecret;
    }
  });

  await t.test('calls next if custom secret matching env variable is provided', () => {
    nextCalled = false;
    const originalSecret = process.env.ADMIN_SECRET;
    process.env.ADMIN_SECRET = 'my-custom-secret';

    const req = { headers: { 'x-admin-secret': 'my-custom-secret' } };
    const res = createRes();

    authenticateAdmin(req, res, next);

    assert.strictEqual(nextCalled, true);

    if (originalSecret !== undefined) {
      process.env.ADMIN_SECRET = originalSecret;
    } else {
      delete process.env.ADMIN_SECRET;
    }
  });
});
