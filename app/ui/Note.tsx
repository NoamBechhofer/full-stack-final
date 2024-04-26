import React from 'react';

/**
 * This is the form that props should take when passed to the Note component.
 */
interface INoteProps {
  /**
   * The key is used to uniquely identify the note for React.
   */
  key: string;
  /**
   * The title of the note.
   */
  title: string;
  /**
   * The content of the note.
   */
  content: string;
  /**
   * The delete_func is used to delete the note from the notes array and the page.
   */
  delete_func: () => void;
}

export default function Note(props: INoteProps) {
  let old_color: string;
  let old_font_size: string;

  function make_button_text_red_on_mouseover(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    old_color = (event.target as HTMLButtonElement).style.color;
    old_font_size = (event.target as HTMLButtonElement).style.fontSize;

    (event.target as HTMLButtonElement).style.color = 'red';
    (event.target as HTMLButtonElement).style.fontSize = '1.5em';
  }
  function return_button_text_to_normal_on_mouseout(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    (event.target as HTMLButtonElement).style.color = old_color;
    (event.target as HTMLButtonElement).style.fontSize = old_font_size;
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button
        type="button"
        onMouseOver={make_button_text_red_on_mouseover}
        onMouseOut={return_button_text_to_normal_on_mouseout}
        onClick={props.delete_func}
      >
        ×
      </button>
    </div>
  );
}
