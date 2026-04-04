"use client";

interface ProfileProps {
  user?: any;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div>
      hello, 
      {user ? (
        <span>{user.name}</span>
      ) : (
        <span>unknown user</span>
      )}
    </div>
  );
}