import { Link, useNavigate } from 'react-router-dom'
import {useState} from 'react'
import axiosInstance from '../../axiosCalls/axios'

function Register(){
    const [form, setForm]= useState({name:"",email:"",password  :"", phone:""})
    const [err,setErr] = useState('')
    const[loader, setLoader]= useState(false)
    const handleChange = (e)=> {
        setForm((prev)=>({...prev,[e.target.name]: e.target.value }))
    }
    const handleSubmit= async(e)=> {
        e.preventDefault() 
        setErr('')
        setLoader(true)
        try{
            await axiosInstance.post('/customers/register', form)
        }
        catch(error){

        }
    }
    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-2xl font-extrabold text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">SST Social</h1>
          <p className="mt-2 text-base text-slate-500 font-medium">Connect. Share. Build your circle.</p>
        </div>

        {/* Register Card */}
        <div className="w-full rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/60 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">Sign up to continue to SST Social.</p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm font-medium text-red-600">{err}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
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
                onChange={handleChange}
                value={form.password}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            {/*Phone number */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                onChange={handleChange}
                value={form.phone}
                placeholder="+91xxxxxxxxxx"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>

            {/* Account creation Button */}
            <button
              type="submit"
              disabled={loader}
              className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loader ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-bold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline hover:underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register;