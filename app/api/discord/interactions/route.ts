import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
} from 'discord-interactions';
import { handleSlashCommand } from '@/bot/handlers/slashCommandHandler';

const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY || '';

if (!PUBLIC_KEY) {
  console.warn('[v0] DISCORD_PUBLIC_KEY not configured - Discord interactions will fail');
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const body = await request.text();

    // Verify Discord request signature
    const isValidRequest = verifyKey(body, signature, timestamp, PUBLIC_KEY);

    if (!isValidRequest) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle Discord ping (required for verification)
    if (interaction.type === InteractionType.PING) {
      return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    // Handle slash commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const response = await handleSlashCommand(interaction);
      return NextResponse.json(response);
    }

    // Handle button interactions
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      // TODO: Add message component handling (buttons, select menus, etc.)
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'This interaction is not yet implemented.',
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }

    return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
  } catch (error) {
    console.error('Discord interaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
