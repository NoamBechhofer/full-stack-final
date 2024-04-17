"use client";

import React from 'react';
import Note from './Note';
import NewNote from './NewNote';
import { createNote, getNotes, deleteNote } from '@/app/lib/placeholder-data';

import { assert } from 'chai';

export default function App() {
  const notes = getNotes();
  let [notes_components_state, set_notes_components_state] = React.useState(
    new Array<React.JSX.Element>(),
  );

  const render_note = (note: {
    key: number;
    title: string | null;
    content: string | null;
  }) => {
    const key = String(note.key) + '-note';
    set_notes_components_state((prevNotes) => {
      return [
        ...prevNotes,
        <Note
          key={key}
          title={note.title ? note.title : ''}
          content={note.content ? note.content : ''}
          delete_func={() => delete_note(key)}
        ></Note>,
      ];
    });
  };

  function add_note(note: { title: string; content: string }) {
    const db_note = createNote(note);
    render_note({
      key: db_note[0].key,
      title: db_note[0].title ? db_note[0].title : '',
      content: db_note[0].content ? db_note[0].content : '',
    });
  }

  function delete_note(key: string) {
    const id = parseInt(key.split('-')[0]);
    deleteNote(id);
    set_notes_components_state((prevNotes) =>
      prevNotes.filter((note) => note.key !== key),
    );
  }

  /*
   * Only need to render the pre-loaded notes once - the empty array indicates
   * this to React.
   * This renders the preloaded notes when the page is first loaded. See
   * `../resources/notes.ts`
   */
  /**
   * Flag to check if we've already rendered the preloaded notes. This is
   * necessary because in development mode, the useEffect hook runs twice.
   */
  let didInit = false;
  React.useEffect(() => {
    // Only run once
    if (didInit) {
      return;
    } else {
      didInit = true;
    }
    notes.forEach((note) => render_note(note));
  }, []);

  return (
    <main>
      <NewNote submit_func={add_note} />
      <div id="notes-container">{notes_components_state}</div>
    </main>
  );
}
