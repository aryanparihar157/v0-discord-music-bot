import { NextRequest, NextResponse } from 'next/server';
import client from '@/bot';

let botStarted = false;

export async function POST(request: NextRequest) {
  try {
    const token = process.env.DISCORD_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'DISCORD_TOKEN not configured' },
        { status: 400 }
      );
    }

    if (botStarted) {
      return NextResponse.json(
        { message: 'Bot is already running' },
        { status: 200 }
      );
    }

    // Start the bot
    await client.login(token);
    botStarted = true;

    return NextResponse.json(
      { message: 'Bot started successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error starting bot:', error);
    return NextResponse.json(
      { error: 'Failed to start bot' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      status: botStarted ? 'running' : 'stopped',
      version: '1.0.0'
    },
    { status: 200 }
  );
}
