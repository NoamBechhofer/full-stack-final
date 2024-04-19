'use client';

import React, { useEffect, useReducer } from 'react';

import Note from './Note';
import NewNote from './NewNote';
import UserInfo from './UserInfo';
import { createNote, getNotes, deleteNote } from '@/app/lib/data';

import { assert } from 'chai';

import { useSession } from 'next-auth/react';

export default function App() {
  const [update, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const { data: session, status } = useSession();

  const [user_id, set_user_id] = React.useState<string>('');

  useEffect(() => {
    if (session) {
      assert(session.user);
      assert(session.user.name);
      set_user_id(session.user.name);
    }
  }, [session, status]);

  let [notes_array_state, set_notes_components_state] = React.useState(
    new Array<React.JSX.Element>(),
  );

  useEffect(() => {
    if (!user_id) return;
    getNotes(user_id)
      .then((notes) => {
        set_notes_components_state(
          notes.map((note) => (
            <Note
              key={String(note.id) + '-note'}
              title={note.title ? note.title : ''}
              content={note.content ? note.content : ''}
              delete_func={() =>
                deleteNote(user_id, note.id)
                  .then(() => forceUpdate())
                  .catch((err) => console.log(err))
              }
            ></Note>
          )),
        );
      })
      .catch((err) => console.log(err));
  }, [update, user_id]);

  function add_note(note: { title: string; content: string }) {
    createNote(user_id, note)
      .then((db_note) => {
        assert(db_note.length === 1);
        forceUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main>
      {session ? <UserInfo session={session}></UserInfo> : <></>}
      <NewNote submit_func={add_note} />
      <div
        id="notes-container"
        style={{
          flexFlow: 'wrap',
          justifyContent: 'center',
        }}
      >
        {notes_array_state}
      </div>
    </main>
  );
}
