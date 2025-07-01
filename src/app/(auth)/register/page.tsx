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
      callbackUrl: 'user/dashboard',
    })
  },
  onError: (err) => {
    setError(err.message || 'Échec de l’inscription.')
  },
})
const handleRegister = (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  register.mutate({ email, password }) // ✅ UN seul appel ici
}


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>

            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                type="button"
                  onClick={() => signIn('google', { callbackUrl: '/user/dashboard' })}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center"
                >
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      {/* Google logo placeholder */}
                      <circle cx="20" cy="20" r="10" fill="gray" />
                    </svg>
                  </div>
                  <span className="ml-4">Sign Up with Google</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 bg-white">
                  Or sign up with email
                </div>
              </div>

              <form onSubmit={handleRegister} className="mx-auto max-w-xs">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />

                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-8 py-4 mt-5 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />

                {error && (
                  <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={register.status === 'pending'}
                  className="mt-5 font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    {register.status === 'pending' ? 'Enregistrement...' : 'Sign Up'}
                  </span>
                </button>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  En m'inscrivant, j'accepte les{' '}
                  <a href="#" className="border-b border-gray-500">
                    Conditions d'utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="border-b border-gray-500">
                    Politique de confidentialité
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          />
        </div>
      </div>
    </div>
  )
}
