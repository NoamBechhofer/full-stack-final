'use server';

import { sql } from '@vercel/postgres';
import { Note } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

import 'dotenv/config';
import { cookies } from 'next/headers';

function get_user_table_name(user_id: string) {
  return `notes_${user_id}`;
}

export async function drop_user_table(user_id: string) {
  noStore();
  try {
    await sql.query<Note>(
      `DROP TABLE IF EXISTS ${get_user_table_name(user_id)}`
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to drop table for user.');
  }
}

export async function transfer_cookie_id_notes_to_registered_user_id_notes(
  registered_user_id: string
) {
  const cookie_user_id = cookies().get('user_id')?.value;
  if (!cookie_user_id) {
    return;
  }
  await sql
    .query<Note>(
      `
    INSERT INTO ${get_user_table_name(registered_user_id)}
    (title, content)
    SELECT title, content
    FROM ${get_user_table_name(cookie_user_id)}
    ORDER BY id ASC
  `
    )
    .catch((error) => console.error('Database Error:', error));
  await drop_user_table(cookie_user_id);
}

export async function register_user_if_not_already_registered(user_id: string) {
  try {
    await sql.query<Note>(`
    CREATE TABLE IF NOT EXISTS ${get_user_table_name(user_id)} (
      id SERIAL PRIMARY KEY,
      title TEXT,
      content TEXT
    )`);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create table for user.');
  }
}

/** If the user's table does not exist, returns an empty array */
export async function getNotes(user_id: string) {
  noStore();
  try {
    const notes = await sql.query<Note>(
      `SELECT * FROM ${get_user_table_name(user_id)}`
    );
    return notes.rows;
  } catch (error: any) {
    if (error && error.code && error.code === '42P01') {
      return [];
    }
    console.error('Database Error:', error);
    throw new Error('Failed to fetch notes.');
  }
}

export async function deleteNote(user_id: string, id: number) {
  noStore();
  try {
    await sql.query<Note>(
      `DELETE FROM ${get_user_table_name(user_id)} WHERE id = $1`,
      [id]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete note.');
  }
}

export async function createNote(
  user_id: string,
  note: { title: string; content: string }
) {
  noStore();
  try {
    const newNote = await sql.query<Note>(
      `
      INSERT INTO ${get_user_table_name(user_id)} (title, content)
      VALUES ($1, $2)
      RETURNING *`,
      [note.title, note.content]
    );
    return newNote.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create note.');
  }
}
