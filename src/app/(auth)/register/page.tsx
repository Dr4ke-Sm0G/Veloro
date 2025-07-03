'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const register = api.user.register.useMutation({
    onSuccess: async () => {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/user/dashboard',
      })
    },
    onError: (err) => setError(err.message || 'Registration failed.'),
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    register.mutate({ email, password })
  }

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
    <div className="flex flex-col justify-center items-center text-white bg-[#5EABD6] px-13 text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
      <p className="text-base max-w-xs">
        Welcome back! We are so happy to have you here. It’s great to see you again. We hope you had a safe and enjoyable time away.
      </p>
    </div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Veloro</h2>
          <p className="text-xl text-gray-600 text-center">Welcome!</p>

          {error && <p className="mt-4 p-2 bg-red-100 text-red-700 text-center text-sm rounded">{error}</p>}

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/user/dashboard' })}
            className="flex items-center justify-center mt-4 text-white bg-white border rounded-lg shadow-md hover:bg-gray-100 w-full"
          >
            <div className="px-4 py-3">
              <svg className="h-6 w-6" viewBox="0 0 533.5 544.3">
  <path
    d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
    fill="#4285f4"
  />
  <path
    d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
    fill="#34a853"
  />
  <path
    d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
    fill="#fbbc04"
  />
  <path
    d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
    fill="#ea4335"
  />
</svg>

            </div>
            <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign up with Google</h1>
          </button>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4" />
            <span className="text-xs text-center text-gray-500 uppercase">or sign up with email</span>
            <span className="border-b w-1/5 lg:w-1/4" />
          </div>

          <form onSubmit={handleRegister}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 w-full appearance-none focus:outline-none focus:shadow-outline"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 w-full appearance-none focus:outline-none focus:shadow-outline"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={register.status === 'pending'}
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                {register.status === 'pending' ? 'Registering...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <a href="/login" className="text-xs text-gray-500 uppercase">
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
