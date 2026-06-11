import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";
import { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "receptionist-login",
      name: "Receptionist Login",
      credentials: {
        hospitalCode: { label: "Hospital Code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.hospitalCode || !credentials?.password) return null;

        const { data: hospital } = await supabaseAdmin
          .from('hospitals')
          .select('id, name')
          .eq('id', credentials.hospitalCode)
          .single();

        if (hospital && credentials.password === "admin123") {
          return {
            id: hospital.id,
            name: hospital.name,
            role: "receptionist",
            hospitalId: hospital.id,
          } as User;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { data: existingPatient } = await supabaseAdmin
          .from("patients")
          .select("id")
          .eq("email", user.email!)
          .single();

        if (!existingPatient) {
          await supabaseAdmin.from("patients").insert({
            email: user.email,
            name: user.name,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role || "patient";
        if ((token as any).role === "patient") {
          const { data: patient } = await supabaseAdmin
            .from("patients")
            .select("id")
            .eq("email", token.email!)
            .single();
          (token as any).patient_id = patient?.id;
        } else {
          (token as any).hospital_id = (user as any).hospitalId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).patient_id = (token as any).patient_id;
        (session.user as any).hospital_id = (token as any).hospital_id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
