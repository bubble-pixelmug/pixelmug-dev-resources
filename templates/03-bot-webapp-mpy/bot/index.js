import { BubbleBot, InlineKeyboard } from '@jeejio-bubble/bot/sdk';
import PixelMugS1 from '@jeejio-bubble/bot/devices/pixelmug-s1';

const bot = new BubbleBot(requiredEnv('BOT_TOKEN'), {
  apiBaseUrl: process.env.BOT_API_BASE_URL,
  webAppDeviceAccess: 'any',
});
bot.registerDevices([new PixelMugS1()]);
const webAppUrl = requiredEnv('STUDIO_WEBAPP_URL');
const mpsId = requiredEnv('STUDIO_MPS_ID');
const mpsVersion = requiredEnv('STUDIO_MPS_VERSION');
const launchUrl = new URL(webAppUrl);
launchUrl.searchParams.set('mps_id', mpsId);
launchUrl.searchParams.set('mps_version', mpsVersion);

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();
  console.log(`Bot log: ${text}`);

  if (text === '/help') {
    await ctx.sendText('This is a Bot + WebApp + device-side MPY PixelMug app template. \n\nUse the WebApp to install the device program, connect over Bluetooth.\n\nUse /bindPixelMug to bind a device, then use /webApp to open the controller.');
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
    await ctx.sendKeyboard('Open the WebApp to install MPY and interact with the device over Bluetooth.',
      new InlineKeyboard().url('Open WebApp', launchUrl.toString()));
  }
});

bot.on('error', (ctx) => console.error(ctx.error.message));
await bot.setCommands([
  { command: 'help', description: 'Show help information' },
  { command: 'bindPixelMug', description: 'Bind a PixelMug' },
  { command: 'webApp', description: 'Open the WebApp' },
]);
await bot.start();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
