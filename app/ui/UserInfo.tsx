import { assert } from 'chai';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

type Status = 'authenticated' | 'loading' | 'unauthenticated';

function header_text(session: {
  data: Session | null;
  status: Status;
}): string {
  switch (session.status) {
    case 'loading':
      return 'Loading...';
    case 'authenticated': {
      const name = session.data?.user?.name;
      assert(name);
      return name;
    }
    case 'unauthenticated':
      return `Guest`;
    default:
      assert(false);
  }
}

function profile_pic_src(session: {
  data: Session | null;
  status: Status;
}): string {
  switch (session.status) {
    case 'loading':
      return 'https://placehold.co/128/png?text=?';
    case 'authenticated':
      return session.data?.user?.image || 'https://placehold.co/128/png?text=!';
    case 'unauthenticated':
      return 'https://placehold.co/128/png?text=?';
    default:
      assert(false);
  }
}

function auth_button(session: { data: Session | null; status: Status }) {
  switch (session.status) {
    case 'loading':
      return (
        <button className="sign-out" disabled>
          Please Wait
        </button>
      );
    case 'authenticated':
      return (
        <button className="sign-out" onClick={() => signOut()}>
          Sign out
        </button>
      );
    case 'unauthenticated':
      return (
        <button
          className="sign-out"
          type="button"
          onClick={() => {
            location.href = '/api/auth/signin?callbackUrl=%2F';
          }}
        >
          Sign in
        </button>
      );
    default:
      assert(false);
  }
}

export default function UserInfo() {
  const session = useSession();

  return (
    <div style={{ margin: '1em auto' }}>
      <h1 style={{ textAlign: 'center' }}>{header_text(session)}</h1>

      <Image
        src={profile_pic_src(session)}
        width={128}
        height={128}
        alt={'profile pic'}
        priority={true}
        style={{
          margin: '1em auto',
          display: 'block',
          borderRadius: '50%',
        }}
      />

      {auth_button(session)}
    </div>
  );
}
