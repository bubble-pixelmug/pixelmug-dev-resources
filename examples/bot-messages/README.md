# Bot Messages

A Bot-only example of sending Markdown and handling a user's quoted reply.

## Run in Studio

1. Open this directory in Studio and select `bot/index.js` as the Bot entry point.
2. Select a Bot with a configured token in **My Bubble** and start the Agent.
3. Choose `/markdown` from the Bot command menu, or send it as text, to receive a formatted message.
4. Reply to that message using the Bubble app's quote/reply action. The Bot displays the quoted content and your reply as plain text.

Other text messages receive a quoted reply from the Bot. A quoted message triggers `message:reply`, not `message:text`.

Studio injects `BOT_TOKEN` and `BOT_API_BASE_URL`. When running outside Studio, `BOT_TOKEN` is required; `BOT_API_BASE_URL` is optional and defaults to the SDK endpoint.

## Files

- `bot/index.js` registers the text and quoted-reply handlers.
- `package.json` declares the Bot SDK dependency.
- `package-lock.json` locks the dependency tree used by Studio and cloud builds.
