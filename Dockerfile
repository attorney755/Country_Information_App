# I used the official Nginx Alpine image as the base because it's lightweight and efficient for serving web applications.
FROM nginx:alpine

# I removed the default Nginx website because I want to replace it with my custom application files.
RUN rm -rf /usr/share/nginx/html/*

# I copied my application files to the Nginx directory because this is where Nginx serves static content from by default.
COPY . /usr/share/nginx/html

# I exposed port 80 because it's the standard HTTP port that Nginx listens on for incoming web traffic.
EXPOSE 80

# I used this command to start Nginx in the foreground because it keeps the container running and serving requests.
CMD ["nginx", "-g", "daemon off;"]
