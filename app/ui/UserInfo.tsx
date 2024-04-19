import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function UserInfo(props: { session: Session }) {
  const session = props.session;
  return (
    <div style={{ margin: '1em auto' }}>
      <h1 style={{ textAlign: 'center' }}>{`${session.user?.name}`}</h1>

      <Image
        src={session.user?.image || 'https://placehold.co/128'}
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

      <button className="sign-out" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
