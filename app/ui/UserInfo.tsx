import { Session } from 'next-auth';
import Image from 'next/image';

export default function UserInfo(props: { session: Session }) {
  const session = props.session;
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{`${session.user?.name}`}</h1>
      <Image
        src={
          session.user?.image ? session.user?.image : 'https://placehold.co/128'
        }
        width={128}
        height={128}
        alt={'profile pic'}
        priority={true}
        style={{
          margin: '0 auto',
          display: 'block',
          borderRadius: '50%'
        }}
      />
    </div>
  );
}
