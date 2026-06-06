import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash || !user.isActive) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true;
      const dbUser = await prisma.user.findUnique({ where: { email: user.email }, select: { isActive: true } });
      return dbUser?.isActive !== false;
    },
    async jwt({ token, user }) {
      if (user) {
        let dbUser = user.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null;
        if (!dbUser && user.email) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? user.email.split("@")[0],
              image: user.image,
              role: "TRAVELER"
            }
          });
        }
        token.id = dbUser?.id ?? user.id;
        token.role = dbUser?.role ?? ("role" in user ? user.role : "TRAVELER");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    newUser: "/register"
  }
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId || typeof userId !== "string") return null;

  return prisma.user.findFirst({
    where: { id: userId, isActive: true },
    select: { id: true, name: true, email: true, role: true, image: true }
  });
}
