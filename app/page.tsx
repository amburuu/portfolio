import { auth0 } from "../src/lib/auth0";
import LoginButton from "../src/components/LoginButton";
import LogoutButton from "../src/components/LogoutButton";
import StartButton from "../src/components/StartButton";
import Profile from "../src/components/Profile";
import Clock from "../src/components/Clock";
import ChaosSceneWrapper from "../src/components/ChaosSceneWrapper";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="flex-col text-center justify-center">
      <div className="text-right">
        <Clock />
      </div>
      <div className="">
        <Profile user={user} />
      </div>
      <div className="">
        <ChaosSceneWrapper />
      </div>
      <div className="flex justify-center">
        <StartButton />
      {user ? (
        <div className="">
          <LogoutButton />
        </div>
      ) : (
        <div className="">
          <LoginButton />
        </div>
      )}
      </div>
    </main>
  );
}