FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install minimal required libraries for the GC_tk binary
RUN apt-get update && apt-get install -y \
    libc6 \
    libstdc++6 \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Copy binary and internal assets to working directory
COPY data/binary/GC_tk /app/GC_tk
COPY data/binary/_internal /app/_internal

# Ensure binary is executable
RUN chmod +x /app/GC_tk

# Create logs directory (if not already present)
RUN mkdir -p /app/logs

# Expose the application port
EXPOSE 6102

# Environment variables for database configuration
# Default to SQLite. To use MySQL, set DATABASE_TYPE=mysql and provide MySQL credentials.
ENV DATABASE_TYPE=sqlite \
    DATABASE_NAME=data.db \
    DATA_DIR=./data \
    LOGS_DIR=./logs \
    HOST=0.0.0.0 \
    PORT=6102 \
    WEB_APP_ROOT=./web

# Start the application
CMD ["./GC_tk"]
