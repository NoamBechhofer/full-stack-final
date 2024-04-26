import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';

import { assert } from 'chai';

import Discord from 'next-auth/providers/discord';

import 'dotenv/config';
import {
  register_user_if_not_already_registered,
  transfer_cookie_id_notes_to_registered_user_id_notes,
} from '@/app/lib/data';

const discord_client_id = process.env.DISCORD_CLIENT_ID;
if (!discord_client_id) {
  throw new Error('DISCORD_CLIENT_ID is not set');
}
const discord_client_secret = process.env.DISCORD_CLIENT_SECRET;
if (!discord_client_secret) {
  throw new Error('DISCORD_CLIENT_SECRET is not set');
}

const nextauth_secret = process.env.NEXTAUTH_SECRET;
if (!nextauth_secret) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
const scopes = ['identify'].join(' ');

export const config = {
  providers: [
    Discord({
      clientId: discord_client_id,
      clientSecret: discord_client_secret,
      authorization: { params: { scope: scopes } },
    }),
  ],
  secret: nextauth_secret,
  callbacks: {
    async signIn(params) {
      const user_id = params.user.name;
      assert(user_id);
      await register_user_if_not_already_registered(user_id);
      await transfer_cookie_id_notes_to_registered_user_id_notes(user_id);
      return true;
    },
  },
} satisfies NextAuthOptions;

// Use in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
