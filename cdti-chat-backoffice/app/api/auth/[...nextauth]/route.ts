import NextAuth, {
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/utils/db/mongoAdapterClient";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/utils/db/mongodb";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string | unknown;
    id?: string | unknown;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        await connectDB();
        const user = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!user) throw new Error("Email");

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) throw new Error("Password");
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(client),
  jwt: {
    maxAge: 60 * 30,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
