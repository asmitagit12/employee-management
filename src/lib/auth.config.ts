import { NextAuthConfig, User } from 'next-auth'
import prisma from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '@/utils/constant'

const authConfig: NextAuthConfig = {
  secret: AUTH_SECRET,

  providers: [
    Credentials({
      name: 'Credentails',
      credentials: {
        token: { label: 'token', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials): Promise<User | null> {
        const data = {
          token: credentials?.token as string,
          email: credentials?.email as string,
          password: credentials?.password as string
        }

        /* GET User details */
        const user = await prisma.user.findUnique({
          where: { email: data.email }
        })

        if (
          !user ||
          !(await bcrypt.compare(data.password, user.password as string))
        ) {
          return null
        }
        return {
          id: user.id,
          name: user.name,
          email: data.email,
          role: user.role
        }
      }
    }),

    GitHub({
      name: 'GitHub',
      clientId: GITHUB_ID as string,
      clientSecret: GITHUB_SECRET as string
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 10 * 60,
    updateAge: 5 * 60
  },

  callbacks: {
    async signIn ({ user, account, profile }) {
      console.log('signIn - user', user) // info related user
      console.log('signIn - account', account) // info related auth provider
      console.log('signIn - profile', profile) // same as user

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string }
      })

      if (!existingUser) {
        // Add user to database
        await prisma.user.create({
          data: {
            email: user.email as string,
            name: user?.name || '',
            firstName: user?.name?.split(' ')[0] || '',
            lastName: user?.name?.split(' ')[1] || '',
            role: 'USER' // Set default role if not provided
          }
        })
      }
      return true
    },

    // `jwt` callback to include the role in the token
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role // Add role to token
      }
      return token
    },

    // `session` callback to add role to session
    async session ({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string // Assert that token.role is a string
      }
      return session
    }

    // authorized: async ({ auth }) => {
    //     return !!auth
    // },
  },

  events: {
    async signOut (message) {
    //   console.log("SignOut Event", message);
    }
  },

  pages: {
    signIn: '/signin'
  }
}

export default authConfig
