import { BubbleBot } from '@jeejio-bubble/bot/sdk';
import PixelMugS1 from '@jeejio-bubble/bot/devices/pixelmug-s1';

const bot = new BubbleBot(requiredEnv('BOT_TOKEN'), {
  apiBaseUrl: process.env.BOT_API_BASE_URL,
});
const mug = new PixelMugS1();
bot.registerDevices([mug]);

const mpsId = requiredEnv('STUDIO_MPS_ID');
const mpsVersion = requiredEnv('STUDIO_MPS_VERSION');
const pendingInstalls = new Map();

async function finishInstall(deviceId, message) {
  const pending = pendingInstalls.get(deviceId);
  if (!pending) return;
  pendingInstalls.delete(deviceId);
  clearTimeout(pending.timer);
  await pending.ctx.sendText(message);
}

bot.on('device_notify', async (ctx) => {
  const deviceId = String(ctx.from?.id || '');
  for (const event of mug.parseNotify(ctx.tal?.notify || [])) {
    const value = event.params?.value;
    if (event.name === 'mpyVmError') {
      await finishInstall(deviceId, `Device program error: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
    } else if (event.name === 'mpyVmEvent') {
      if (value === 'MPS_IS_RUNNING') await finishInstall(deviceId, 'Device code is running on PixelMug.');
      if (value === 'INSTALL_FAIL') await finishInstall(deviceId, 'Device code installation failed. Check the Studio device log.');
      if (value === 'RUNNING_FAIL') await finishInstall(deviceId, 'Device code failed to start. Check the Studio device log.');
    }
  }
});

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();

  if (text === '/help') {
    await ctx.sendText('This is a Bot + device-side MPY PixelMug app template. \n\nIt does not require a WebApp. Use /bindPixelMug to bind a device, then send /installMPY to deploy and start the current mpy/ code.');
    return;
  }

  if (text === '/bindPixelMug') {
    await ctx.sendBindDevice({
      content: 'Select the PixelMug S1 you want to bind.',
      actionButtonTitle: 'Bind PixelMug',
    });
    return;
  }

  if (text !== '/installMPY') return;

  const [device] = await bot.getBoundDevices(ctx);
  if (!device) {
    await ctx.sendBindDevice({ content: 'Bind a PixelMug S1 before installing device code.' });
    return;
  }

  const deviceId = String(device.deviceId);
  if (pendingInstalls.has(deviceId)) {
    await ctx.sendText('The device is already installing or starting device code. Please wait.');
    return;
  }

  const pending = { ctx };
  pendingInstalls.set(deviceId, pending);
  pending.timer = setTimeout(() => {
    finishInstall(deviceId, 'The device did not report a result in time. Check Studio and try again.').catch(console.error);
  }, 120000);
  pending.timer.unref?.();

  try {
    await ctx.sendText('Deploying and starting device code. Please wait.');
    // Studio intercepts this RPC for local runs; cloud deployments use the uploaded MPS.
    const command = mug.rpc.talMpyExecOneScript({ id: mpsId, version: mpsVersion });
    const response = await bot.callDevice(ctx.chat, device, command);
    if (pendingInstalls.get(deviceId) !== pending) return;

    const result = response.tal?.result;
    const value = result?.result ?? result;
    const code = Number(value?.value ?? value?.return ?? value);
    if (code === 264) {
      await finishInstall(deviceId, 'Device code is already running on PixelMug.');
    } else if ([260, 261, 262, 263, 265].includes(code)) {
      await ctx.sendText('The deployment request was accepted. Waiting for the device.');
    } else {
      await finishInstall(deviceId, `The device rejected the start request (code ${code}). Check the Studio device log.`);
    }
  } catch (error) {
    if (pendingInstalls.get(deviceId) === pending) {
      await finishInstall(deviceId, `Deployment failed: ${error.message}`);
    }
  }
});

bot.on('error', (ctx) => console.error(ctx.error.message));

await bot.setCommands([
  { command: 'help', description: 'Show help information' },
  { command: 'bindPixelMug', description: 'Bind a PixelMug S1' },
  { command: 'installMPY', description: 'Deploy and run device code' },
]);
await bot.start();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
