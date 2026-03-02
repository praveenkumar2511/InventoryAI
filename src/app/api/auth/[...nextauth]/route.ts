import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                };
            }
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
