# use the latest version of the official nginx image as the base image
FROM nginx:latest
# install updates and vim
RUN apt-get -y update && apt-get -y install vim
# copy the custom nginx configuration file to the container in the
# default location
COPY nginx.conf /etc/nginx/nginx.conf
# copy the built Angular app files to the default nginx html directory
COPY /dist/alfresco-digital-workspace /usr/share/nginx/html