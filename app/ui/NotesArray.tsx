import React from 'react';

export default function NotesArray(props: {
  notes: React.JSX.Element[];
}) {

  return (
    <div
      id="notes-container"
      style={{
        flexFlow: 'wrap',
        justifyContent: 'center',
      }}
    >
      {props.notes}
    </div>
  );
}
