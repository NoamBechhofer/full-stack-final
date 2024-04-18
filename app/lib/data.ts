"use server"

import { sql } from '@vercel/postgres';
import {
  Note
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

import 'dotenv/config';

console.log(process.env.POSTGRES_URL);

export async function getNotes() {
  noStore();
  try {
    const notes = await sql<Note>`SELECT * FROM notes`;
    return notes.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch notes.');
  }
}

export async function deleteNote(id: number) {
  noStore();
  try {
    await sql`DELETE FROM notes WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete note.');
  }
}

export async function createNote(note: { title: string; content: string }) {
  noStore();
  try {
    const newNote = await sql<Note>`
      INSERT INTO notes (title, content)
      VALUES (${note.title}, ${note.content})
      RETURNING *`;
    return newNote.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create note.');
  }
}
