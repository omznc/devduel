import AuthProvider from "@components/providers/auth-provider.tsx";
import ThemeProvider from "@components/providers/theme-provider.tsx";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";

export default async function Providers({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider session={session}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
