import React, { useState } from 'react';
import { setAdminSecret } from '../../utils/auth';

export default function AdminLogin({ onLogin }) {
  const [secret, setSecret] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdminSecret(secret);
    onLogin();
  };

  return (
    <section className="pt-32 pb-12 px-4 min-h-screen flex items-center justify-center">
      <div className="bg-indigo p-8 rounded-xl border border-white/10 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="secret-key" className="block text-sm font-medium text-neutral-400 mb-1">Secret Key</label>
            <input
              id="secret-key"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-primary border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neutral-400"
              required
            />
          </div>
          <button type="submit" className="w-full bg-white text-black py-2 rounded font-medium mt-2 hover:bg-neutral-200">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
