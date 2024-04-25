/**
 * @file NewNote.tsx
 * @brief This file contains the NewNote component.
 * @details This component is used to create new notes.
 */

import { useSession } from 'next-auth/react';
import React from 'react';
export default function NewNote(props: {
  submit_func: (note: { title: string; content: string }) => void;
}) {
  let [note, setNote] = React.useState({ title: '', content: '' });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const new_str: string = event.target.value;
    const source: string = event.target.name;

    setNote((prev: { title: string; content: string }) => {
      if (source === 'title') {
        return { title: new_str, content: prev.content };
      } else if (source === 'content') {
        return { title: prev.title, content: new_str };
      } else {
        console.assert(false, 'Invalid source');
        return prev;
      }
    });
  };
  return (
    <form>
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        value={note.title}
      />
      <textarea
        name="content"
        placeholder="Take a note..."
        onChange={handleChange}
        value={note.content}
        rows={3}
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          props.submit_func(note);
          setNote({ title: '', content: '' });
        }}
      >
        +
      </button>
    </form>
  );
}
