import { BubbleBot } from '@jeejio-bubble/bot/sdk';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is required');

const bot = new BubbleBot(token, {
  apiBaseUrl: process.env.BOT_API_BASE_URL,
});

bot.on('error', (ctx) => {
  console.error('[bot-messages]', ctx.error?.message || ctx.error);
});

bot.on('message:text', async (ctx) => {
  if (ctx.message.text.trim() === '/markdown') {
    await ctx.sendMarkdown(
      '**Markdown message**\n\n'
      + '- This line is a list item.\n'
      + '- Reply to a message to inspect the quoted message.',
    );
    return;
  }

  await ctx.replyText('Send /markdown, then reply to the Markdown message.');
});

bot.on('message:reply', async (ctx) => {
  const reply = ctx.message.reply;
  await ctx.sendText(
    `Quoted message: ${reply.quoted.content || '(no text content)'}\n`
    + `Your reply: ${reply.text}`,
  );
});

await bot.setCommands([
  { command: 'markdown', description: 'Send a Markdown message' },
]);

await bot.start({ device: false });

console.log('Messages example started. Send /markdown in the Bubble app.');
