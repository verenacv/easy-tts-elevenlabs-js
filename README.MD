# 🎤 Discord TTS Bot

## ⚙️ Overview

This is a simple Discord bot that allows users to convert text to speech using ElevenLabs. It joins a voice channel and plays the generated audio in real-time.

## 🔧 Prerequisites

Before running this bot, ensure you have the following:

- **Node.js**: Make sure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Discord Bot**: You need to create a Discord bot and invite it to your server. Follow the [Discord Developer Portal](https://discord.com/developers/applications) for setup instructions.
- **ElevenLabs API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/) to obtain your API key.

## 🚀 Installation

1. **Clone this repository** or download the contents.
2. Navigate to the bot's directory in your terminal.
3. Run ```npm install``` to install the necessary dependencies:
4. Create a .env file in the root directory of the bot and add the following lines:
    ```plaintext 
    SERVER_ICON= # URL for your server icon
    DISCORD_TOKEN= # Your Discord bot token
    DISCORD_CLIENT_ID= # Your Discord client ID
    ELEVEN_LABS= # Your ElevenLabs API key
    ```

Deploy the command with ```node deploy.js``` and start the bot with ```node index.js```

## 🎞️ Usage
Once the bot is running, you can use the /tts command followed by the text you want to convert to speech.
Make sure you are in a voice channel to hear the bot play the audio.

## 📄 Example
/tts Hello, this is a text-to-speech test!
<h3 align="left">Support:</h3> <p align="left"> <a href="https://ko-fi.com/W7W1Q1E53"> <img src="https://ko-fi.com/img/githubbutton_sm.svg" height="50" width="210" alt="Support on Ko-fi" /> </a> </p> ```
