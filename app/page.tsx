import { auth0 } from "../src/lib/auth0";
import LoginButton from "../src/components/LoginButton";
import LogoutButton from "../src/components/LogoutButton";
import StartButton from "../src/components/StartButton";
import Profile from "../src/components/Profile";
import Clock from "../src/components/Clock";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="">
      <div className="">
        <Clock />
      </div>
      <div className="">
        <Profile />
      </div>
      <div className="">
        chaos
      </div>
      <div className="">
        <StartButton />
      </div>
      {user ? (
        <div className="">
          <LogoutButton />
        </div>
      ) : (
        <div className="">
          <LoginButton />
        </div>
      )}
    </main>
  );
}