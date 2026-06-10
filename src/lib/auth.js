import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

/** @type {import("next-auth").NextAuthOptions} */
export const authOptions = {
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
      async authorize(credentials) {
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
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { data: existingPatient } = await supabaseAdmin
          .from("patients")
          .select("id")
          .eq("email", user.email)
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
        token.role = user.role || "patient";
        if (token.role === "patient") {
          const { data: patient } = await supabaseAdmin
            .from("patients")
            .select("id")
            .eq("email", token.email)
            .single();
          token.patient_id = patient?.id;
        } else {
          token.hospital_id = user.hospitalId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.patient_id = token.patient_id;
        session.user.hospital_id = token.hospital_id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
