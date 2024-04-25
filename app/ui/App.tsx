'use client';

import React, { useReducer } from 'react';

import NewNote from './NewNote';
import UserInfo from './UserInfo';
import { createNote, getNotes, deleteNote } from '@/app/lib/data';

import { assert } from 'chai';

import { useSession } from 'next-auth/react';
import NotesArray from './NotesArray';

export default function App() {
  const [update, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const { data: session, status } = useSession();

  function add_note(note: { title: string; content: string }) {
    const user_id = session?.user?.name;
    if (user_id) {
      createNote(user_id, note)
        .then((db_note) => {
          assert(db_note.length === 1);
          forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      assert(false, 'Middleware should force user to be authenticated');
    }
  }

  return (
    <main>
      <UserInfo />
      <NewNote submit_func={add_note} />
      <NotesArray />
    </main>
  );
}
