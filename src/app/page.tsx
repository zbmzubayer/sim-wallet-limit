import { Suspense } from "react";

import auth from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default async function Home() {
  const session = await auth();

  return session?.user ? (
    <>
      <Header />
      <main className="container flex h-screen flex-col items-center justify-center gap-2">
        table
      </main>
    </>
  ) : (
    <main className="container flex h-screen flex-col items-center justify-center gap-2">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-xl uppercase tracking-wider">Admin Panel</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<Spinner className="flex h-full w-full items-center justify-center" />}
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
