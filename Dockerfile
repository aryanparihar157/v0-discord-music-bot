FROM node:20-slim

# Install system dependencies (ffmpeg, python3, curl, ca-certificates for yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies (including typescript and ts-node)
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 7860 for Hugging Face Spaces health checks
EXPOSE 7860

# Start the bot
CMD ["node", "run-bot.js"]
