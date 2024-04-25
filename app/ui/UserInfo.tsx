import { assert } from 'chai';
import { useSession } from 'next-auth/react';
import UserInfoSkeleton from './UserInfoSkeleton';

export default function UserInfo() {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return <UserInfoSkeleton session={session} />;
  } else if (status === 'unauthenticated') {
    assert(false, 'Middleware should force user to be authenticated');
  } else {
    return <UserInfoSkeleton />;
  }
}
