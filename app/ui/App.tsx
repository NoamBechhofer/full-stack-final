'use client';

import React, { useEffect, useReducer, useState } from 'react';

import NewNote from './NewNote';
import {
  createNote,
  getNotes,
  deleteNote,
  register_user_if_not_already_registered
} from '@/app/backend/data';

import { assert } from 'chai';

import { useSession } from 'next-auth/react';
import NotesArray from './NotesArray';
import { Cookies, useCookies } from 'next-client-cookies';
import { Session } from 'next-auth';
import Note from './Note';
import UserInfo from './UserInfo';

interface UserID {
  to_string: () => string;
}

class RegisteredUserID implements UserID {
  session: Session;
  constructor(session: Session) {
    this.session = session;
  }
  to_string(): string {
    assert(this.session.user);
    assert(this.session.user.name);
    return this.session.user.name;
  }
  get_session() {
    return this.session;
  }
}

class GuestUserId implements UserID {
  user_cookie: string;
  constructor(cookies: Cookies) {
    let user_id = cookies.get('user_id');
    if (!user_id) {
      user_id =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      cookies.set('user_id', user_id);
    }
    this.user_cookie = user_id;
  }

  to_string(): string {
    return this.user_cookie;
  }
}

export default function App() {
  const [update, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const { data: session, status } = useSession();
  const cookies = useCookies();

  const [user_id, set_user_id] = useState<UserID | null>(null);

  const [notes_array, set_notes_array] = useState(
    new Array<React.JSX.Element>()
  );

  useEffect(() => {
    switch (status) {
      case 'loading':
        break;
      case 'authenticated':
        set_user_id(new RegisteredUserID(session));
        break;
      case 'unauthenticated':
        set_user_id(new GuestUserId(cookies));
        break;
    }
  }, [status, session, cookies]);

  useEffect(() => {
    if (!user_id) {
      return;
    }
    getNotes(user_id.to_string())
      .then((notes) => {
        set_notes_array(
          notes.map((note) => (
            <Note
              key={String(note.id) + '-note'}
              title={note.title || ''}
              content={note.content || ''}
              delete_func={() =>
                deleteNote(user_id.to_string(), note.id)
                  .then(() => forceUpdate())
                  .catch((err) => console.log(err))
              }
            ></Note>
          ))
        );
      })
      .catch((err) => console.log(err));
  }, [update, user_id]);

  async function add_note(note: { title: string; content: string }) {
    assert(user_id);
    await register_user_if_not_already_registered(user_id.to_string());
    assert((await createNote(user_id.to_string(), note)).length === 1);
    forceUpdate();
  }

  return (
    <main>
      <UserInfo />
      <NewNote submit_func={add_note} />
      {user_id && <NotesArray notes={notes_array} />}
    </main>
  );
}
