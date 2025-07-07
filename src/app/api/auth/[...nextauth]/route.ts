import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/pool";
import bcrypt from "bcrypt";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // Allow sign-in for credentials provider without extra checks
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers
      if (account?.provider === "google") {
        if (!user.email) return false;
      
        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email),
          });

          if (!existingUser) {
            await db.insert(users).values({
              email: user.email!,
              name: user.name!,
              avatarUrl: user.image
            });
          }
          return true;
        } catch (error) {
          console.error("Error during OAuth sign-in DB check:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      // The `user` object is only available on the first sign-in.
      // We persist the user's database ID to the token here.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // The token now contains the user ID, so we can add it to the session object.
      // Note: To make this type-safe, you'll need to augment the `Session`
      // and `User` types in a `next-auth.d.ts` file.
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };