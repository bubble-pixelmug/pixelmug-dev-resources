import { BubbleWebApp } from '@jeejio-bubble/bot/sdk/WebApp.js';
import { rpc } from '@jeejio-bubble/bot/devices/pixelmug-s1/ext';

const text = document.querySelector('#text');
const send = document.querySelector('#send');
const status = document.querySelector('#status');
let webapp;
let device;

send.onclick = async () => {
  const value = text.value.trim();
  if (!value) {
    status.textContent = 'Enter a value first.';
    return;
  }

  send.disabled = true;
  status.textContent = 'Calling device API...';
  try {
    // Replace this sample RPC with the device operation used by your application.
    const command = await rpc.talPrintText({ text: value, color: '#00ff00', speed: 80 });

    await webapp.callDevice(device, command);
    console.log('WebApp log: Device call completed');
    status.textContent = `Device call completed: ${device.name || 'PixelMug'}`;
  } catch (error) {
    console.error('WebApp log: Send Failed:', error);
    status.textContent = error.message;
  } finally {
    send.disabled = false;
  }
};

async function loadDevices() {
  const devices = await webapp.getDevices();
  console.log('WebApp log: get devices:', devices);
  device = devices.find((item) =>
    item.talId === 'PixelMug' ||
    item.talId === 'PixelMugS1' ||
    /pixelmug/i.test(item.name || '')
  );

  if (device) {
    status.textContent = `Ready: ${device.name || 'PixelMug'}`;
    send.disabled = false;
    return;
  }
  status.textContent = 'No PixelMug is connected. Bind a device and reopen this WebApp.';
}

async function initialize() {
  try {
    console.log('WebApp log: Start Initialization');
    webapp = new BubbleWebApp();
    await loadDevices();
  } catch (error) {
    console.error('[init] Initialization failed:', error);
    status.textContent = error.message;
  }
}

initialize();
