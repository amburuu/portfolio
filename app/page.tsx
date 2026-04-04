import { auth0 } from "../src/lib/auth0";
import LoginButton from "../src/components/LoginButton";
import LogoutButton from "../src/components/LogoutButton";
import Profile from "../src/components/Profile";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="min-h-screen bg-[#060812] flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <Profile />
                <LogoutButton />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 w-full">
                <LoginButton />
              </div>
            )}
    </main>
  );
}