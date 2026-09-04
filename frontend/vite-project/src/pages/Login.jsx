import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-2xl font-extrabold text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">ShopKart</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">Retail therapy made simple</p>
        </div>

        {/* Login Card */}
        <div className="w-full rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/60 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
            <p className="mt-2 text-sm text-slate-500">Log in to continue to ShopKart.</p>
          </div>

          
          {err && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm font-medium text-red-600">{err}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loader}
              className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loader ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-bold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline hover:underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login