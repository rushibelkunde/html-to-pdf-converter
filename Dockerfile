# Use Ubuntu as the base image
FROM ubuntu:latest

# Install essential packages
RUN apt-get update -y && \
    apt-get install -y curl python3 python3-pip

# Install Node.js version 16.20.2
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Install Python 3.10.12
RUN curl -O https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz && \
    tar -xzvf Python-3.10.12.tgz && \
    cd Python-3.10.12 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -r Python-3.10.12*

# Install WeasyPrint using pip
RUN pip install weasyprint

RUN apt-get update && apt-get install -y python3-pip python3-cffi python3-brotli libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0

# Set the working directory to /app
WORKDIR /app

# Copy package.json and npm install
COPY package.json .
RUN npm install

# Copy all code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the command to start the Node.js server
CMD ["node", "server.js"]
