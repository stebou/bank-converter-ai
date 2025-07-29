// Fichier : src/app/api/webhooks/clerk/route.ts (ou le chemin que vous utilisez)

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Obtenir les en-têtes - CORRECTION APPLIQUÉE ICI
  const headerPayload = await headers(); // On ajoute 'await'
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Webhook error: Missing svix headers');
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const eventType = evt.type;
  console.log(`[CLERK_WEBHOOK] Received event of type: ${eventType}`);

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      return new Response('Error: Bad data from webhook', { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
        },
      });
      console.log(`[CLERK_WEBHOOK] User ${id} created in database.`);
    } catch (dbError) {
      console.error(`[CLERK_WEBHOOK] Database error creating user ${id}:`, dbError);
      return new Response('Database error', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    if (!id) {
       return new Response('Error: Missing user ID', { status: 400 });
    }

    try {
      await prisma.user.update({
        where: {
          clerkId: id,
        },
        data: {
          email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : undefined,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
        },
      });
      console.log(`[CLERK_WEBHOOK] User ${id} updated in database.`);
    } catch (dbError) {
       console.error(`[CLERK_WEBHOOK] Database error updating user ${id}:`, dbError);
       return new Response('Database error', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
       return new Response('Error: Missing user ID', { status: 400 });
    }

    try {
      await prisma.user.deleteMany({
        where: {
          clerkId: id,
        },
      });
      console.log(`[CLERK_WEBHOOK] User ${id} deleted from database.`);
    } catch (dbError) {
       console.error(`[CLERK_WEBHOOK] Database error deleting user ${id}:`, dbError);
       return new Response('Database error', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}