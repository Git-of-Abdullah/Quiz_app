import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import bcrypt from "bcryptjs"
 const handler = NextAuth({
  
  providers: [
      CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Find user in DB
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        // Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        // Return user object (this becomes session.user)
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
     GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
  ],
   pages: {
    signIn: "/login", // this is your custom login page route
  },
  callbacks: {
  async jwt({ token, user }) {
    // When the user signs in, store role and id in token
    if (user) {
      token.role = user.role || "user";
      token.id = user.id; 
    }
    return token;
  },
  async session({ session, token }) {
    
    session.user.role = token.role;
    session.user.id = token.id; 
    return session;
  }
}

})

export {handler as GET, handler as POST}