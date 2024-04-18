#!/usr/bin/env ts-node

const { db } =require( '@vercel/postgres');
require("dotenv").config();



require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
    target: "ES2018",
  },
})

let notes: {
  key: number;
  title: string;
  content: string;
}[] = [
    {
      key: 1,
      title: 'Delegation',
      content:
        'Q. How many programmers does it take to change a light bulb? A. None – It’s a hardware problem',
    },
    {
      key: 2,
      title: 'Loops',
      content:
        'How to keep a programmer in the shower forever. Show him the shampoo bottle instructions: Lather. Rinse. Repeat.',
    },
    {
      key: 3,
      title: 'Arrays',
      content:
        "Q. Why did the programmer quit his job? A. Because he didn't get arrays.",
    },
    {
      key: 4,
      title: 'Hardware vs. Software',
      content:
        "What's the difference between hardware and software? You can hit your hardware with a hammer, but you can only curse at your software.",
    },
  ];

async function main() {
  const client = await db.connect();


  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT
      );
    `;

    console.log(`Created "notes" table`);

    const insertedNotes = await Promise.all(
      notes.map(async (note) => {
        return client.sql`
        INSERT INTO notes (id, title, content)
        VALUES (${note.key}, ${note.title}, ${note.content})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedNotes.length} notes`);

    console.log({
      createTable,
      users: insertedNotes,
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }

  await client.release();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
