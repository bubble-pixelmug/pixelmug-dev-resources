import { BubbleBot, InlineKeyboard } from '@jeejio-bubble/bot/sdk';
import PixelMugS1 from '@jeejio-bubble/bot/devices/pixelmug-s1';

const bot = new BubbleBot(requiredEnv('BOT_TOKEN'), {
  apiBaseUrl: process.env.BOT_API_BASE_URL,
  webAppDeviceAccess: 'any',
});
const webAppUrl = process.env.STUDIO_WEBAPP_URL;
if (!webAppUrl) throw new Error('Missing required environment variable: STUDIO_WEBAPP_URL');

const mug = new PixelMugS1();
mug.compatible = ['PixelMug'];
bot.registerDevices([mug]);

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();

  console.log(`Bot log: ${text}`);
  if (text === '/help') {
    await ctx.sendText('This is a Bot + WebApp PixelMug app template.\n\nUse /bindPixelMug to bind a device, then /webApp to open the WebApp.');
    return;
  }

  if (text === '/bindPixelMug') {
    await ctx.sendBindDevice({
      content: 'Select the PixelMug you want to bind.',
      actionButtonTitle: 'Bind PixelMug',
    });
    return;
  }

  if (text === '/webApp') {
    await ctx.sendKeyboard(
      'Open the WebApp to interact with the bound device.',
      new InlineKeyboard().url('Open WebApp', webAppUrl),
    );
  }
});

bot.on('error', (ctx) => console.error(ctx.error.message));

await bot.setCommands([
  { command: 'help', description: 'Show help information' },
  { command: 'bindPixelMug', description: 'Bind your PixelMug' },
  { command: 'webApp', description: 'Open the WebApp' },
]);
await bot.start();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
