# Use Ubuntu as the base image
FROM ubuntu:latest

# Install essential packages
RUN apt-get update -y && \
    apt-get install -y curl python3 python3-pip

RUN apt-get update  -y && \
apt install node.js  
# Install WeasyPrint using pip
RUN pip install weasyprint

RUN apt-get install -y python3-pip python3-cffi python3-brotli libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0

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
