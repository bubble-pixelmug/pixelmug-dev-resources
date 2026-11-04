import { BubbleWebApp } from '@jeejio-bubble/bot/sdk/WebApp.js';
import { BleAppClient } from '@jeejio-bubble/bot/sdk/BleAppClient.js';

const install = document.querySelector('#install-mpy');
const connect = document.querySelector('#connect');
const disconnect = document.querySelector('#disconnect');
const reconnect = document.querySelector('#reconnect');
const status = document.querySelector('#status');
const directionButtons = [...document.querySelectorAll('[data-direction]')];

const launchParams = new URLSearchParams(globalThis.location.search);
const mpsId = launchParams.get('mps_id') || import.meta.env.VITE_MPS_ID || '';
const mpsVersion = launchParams.get('mps_version') || import.meta.env.VITE_MPS_VERSION || '';
const directionCodes = { up: 0, down: 1, left: 2, right: 3 };
let webapp;
let client;
let device;
let state = 'disconnected';

function setState(nextState, message) {
  state = nextState;
  status.textContent = message || `BLE is ${nextState}.`;
  status.className = nextState === 'connected'
    ? 'status-connected'
    : nextState === 'disconnected' ? 'status-disconnected' : 'status-pending';
  connect.disabled = nextState === 'connecting' || nextState === 'connected';
  disconnect.disabled = nextState !== 'connected';
  reconnect.disabled = nextState === 'connecting' || !device;
  directionButtons.forEach((button) => { button.disabled = nextState !== 'connected'; });
}

async function getDevice() {
  webapp ||= new BubbleWebApp();
  const [boundDevice] = await webapp.getDevices();
  if (!boundDevice) throw new Error('Bind a PixelMug S1 in Studio first.');
  device = boundDevice;
  return device;
}

install.onclick = async () => {
  install.disabled = true;
  try {
    if (!mpsId || !mpsVersion) throw new Error('MPS ID and version are not configured.');
    const boundDevice = await getDevice();
    const response = await webapp.callDevice(boundDevice, {
      method: 'talMpyExecOneScript',
      params: { id: mpsId, version: mpsVersion },
    });
    const code = mpyExecReturnCode(response);
    if (![260, 261, 262, 263, 264, 265].includes(code)) {
      throw new Error('The device did not accept the MPY install request.');
    }
    status.textContent = code === 264
      ? 'MPY is already running. You can connect over BLE.'
      : 'MPY installation started. Connect over BLE after the device is ready.';
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    install.disabled = false;
  }
};

connect.onclick = async () => {
  setState('connecting', 'Connecting over BLE...');
  try {
    const boundDevice = await getDevice();
    client?.close();
    client = new BleAppClient(webapp.ble, { appId: 'PixelMugTemplate3' });
    client.on('connectionState', (event) => {
      if (event.connection === 'connected' || event.ready) {
        setState('connected', 'BLE connected.');
      } else if (event.connection === 'disconnected' || event.connection === 'failed') {
        setState('disconnected', 'BLE is disconnected.');
      }
    });
    await client.connect(boundDevice);
    setState('connected', 'BLE connected.');
  } catch (error) {
    client?.close();
    setState('disconnected', error instanceof Error ? error.message : String(error));
  }
};

disconnect.onclick = () => {
  client?.close();
  setState('disconnected', 'BLE is disconnected.');
};

reconnect.onclick = async () => {
  if (!client) {
    connect.click();
    return;
  }
  setState('connecting', 'Reconnecting over BLE...');
  try {
    await client.reconnect();
    setState('connected', 'BLE connected.');
  } catch (error) {
    setState('disconnected', error instanceof Error ? error.message : String(error));
  }
};

for (const button of directionButtons) {
  button.onclick = async () => {
    if (state !== 'connected' || !client?.ready) return;
    try {
      await client.sendSimpleRaw(new Uint8Array([directionCodes[button.dataset.direction]]));
      status.textContent = `Sent: ${button.dataset.direction}`;
      status.className = 'status-connected';
    } catch (error) {
      setState('disconnected', error instanceof Error ? error.message : String(error));
    }
  };
}

function mpyExecReturnCode(response) {
  const result = response?.result;
  const value = result && typeof result === 'object'
    ? result.value ?? result.result?.value ?? result.result
    : result ?? response?.value;
  const code = Number(value);
  return Number.isFinite(code) ? code : Number(response?.code);
}

setState('disconnected');
window.addEventListener('pagehide', () => { client?.close(); webapp?.stop(); });
