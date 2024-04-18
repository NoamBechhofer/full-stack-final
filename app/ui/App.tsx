'use client';

import React, { useEffect } from 'react';

import Note from './Note';
import NewNote from './NewNote';
import UserInfo from './UserInfo';
import { createNote, getNotes, deleteNote } from '@/app/lib/data';
import { Note as NoteType } from '../lib/definitions';

import { assert } from 'chai';

import { useSession } from 'next-auth/react';

export default function App() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(
      status === 'loading'
        ? `${status}...`
        : status === 'authenticated'
          ? `${session}`
          : `${status}`,
    );
  }, [session, status]);

  let [notes_components_state, set_notes_components_state] = React.useState(
    new Array<React.JSX.Element>(),
  );

  const render_note = (note: NoteType) => {
    const key = String(note.id) + '-note';
    set_notes_components_state((prevNotes) => {
      return [
        ...prevNotes,
        <Note
          key={key}
          title={note.title ? note.title : ''}
          content={note.content ? note.content : ''}
          delete_func={() => remove_note(key)}
        ></Note>,
      ];
    });
  };

  function add_note(note: { title: string; content: string }) {
    createNote(note)
      .then((db_note) => {
        assert(db_note.length === 1);
        render_note({
          id: db_note[0].id,
          title: db_note[0].title ? db_note[0].title : '',
          content: db_note[0].content ? db_note[0].content : '',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function remove_note(key: string) {
    const id = parseInt(key.split('-')[0]);
    deleteNote(id)
      .then(() => {
        set_notes_components_state((prevNotes) =>
          prevNotes.filter((note) => note.key !== key),
        );
      })
      .catch((err) => console.log(err));
  }

  /**
   * In strict mode, components render twice. This boolean flag will prevent us
   * from loading (and subsequently rendering) the notes from the database
   * twice.
   */
  let already_rendered = false;

  useEffect(() => {
    if (already_rendered) return;
    else already_rendered = true;
    getNotes()
      .then((notes) => {
        notes.forEach((note) => render_note(note));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <main>
      {session ? <UserInfo session={session}></UserInfo> : <></>}
      <NewNote submit_func={add_note} />
      <div id="notes-container">{notes_components_state}</div>
    </main>
  );
}
