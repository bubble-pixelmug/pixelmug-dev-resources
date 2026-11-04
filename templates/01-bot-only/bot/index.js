import { BubbleBot } from '@jeejio-bubble/bot/sdk';
import PixelMugS1 from '@jeejio-bubble/bot/devices/pixelmug-s1/ext';

const bot = new BubbleBot(requiredEnv('BOT_TOKEN'), {
  apiBaseUrl: process.env.BOT_API_BASE_URL,
});
const mug = new PixelMugS1();
mug.compatible = ['PixelMug'];
bot.registerDevices([mug]);

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();

  console.log('Bot log:', text);

  if (text === '/help') {
    await ctx.sendText('This is a Bot-only PixelMug app template. It demonstrates a Bot calling a built-in device API.\n\nUse /bindPixelMug to bind a device.');
    return;
  }

  if (text === '/bindPixelMug') {
    await ctx.sendBindDevice({
      content: 'Select the PixelMug you want to bind.',
      actionButtonTitle: 'Bind PixelMug',
    });
    return;
  }

  if (!(await bot.isDeviceBound(ctx, mug))) {
    await ctx.sendBindDevice({ content: 'Bind your PixelMug before sending a message.' });
    return;
  }
  if (!text) return;

  try {
    // Replace this sample RPC with the device operation used by your application.
    const rpc = await mug.rpc.talPrintText({ text, color: '#00ff00', speed: 80 });
    await bot.callDevice(ctx.chat, mug, rpc);
    await ctx.sendText(`PixelMug received: ${text}`);
  } catch (error) {
    await ctx.sendText(`Display failed: ${error.message}`);
  }
});

bot.on('error', (ctx) => console.error(ctx.error.message));

await bot.setCommands([
  { command: 'help', description: 'Show help information' },
  { command: 'bindPixelMug', description: 'Bind your PixelMug' },
]);
await bot.start();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
