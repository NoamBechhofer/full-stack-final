import { useSession } from 'next-auth/react';
import React, { useEffect, useReducer } from 'react';
import { deleteNote, getNotes } from '../lib/data';
import { assert } from 'chai';
import Note from './Note';

export default function NotesArray() {
  const [update, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const [notes_array_state, set_notes_components_state] = React.useState(
    new Array<React.JSX.Element>(),
  );
  const { data: session, status } = useSession();

  const [user_id, set_user_id] = React.useState<string>('');

  useEffect(() => {
    if (session) {
      assert(session.user);
      assert(session.user.name);
      set_user_id(session.user.name);
    }
  }, [session, status]);

  useEffect(() => {
    if (!user_id) return;
    getNotes(user_id)
      .then((notes) => {
        set_notes_components_state(
          notes.map((note) => (
            <Note
              key={String(note.id) + '-note'}
              title={note.title || ''}
              content={note.content || ''}
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
  return (
    <div
      id="notes-container"
      style={{
        flexFlow: 'wrap',
        justifyContent: 'center',
      }}
    >
      {notes_array_state}
    </div>
  );
}
