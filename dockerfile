# use the latest version of the official nginx image as the base image
FROM nginx:latest
# install updates, vim and python
RUN apt-get -y update && apt-get -y install vim
RUN apt-get install -y python3 python3-pip && \
        rm -rf /var/lib/apt/lists/*
# copy the custom nginx configuration file to the container in the
# default location
COPY nginxforfileplan.conf /etc/nginx/nginx.conf
# copy the built Angular app files to the default nginx html directory

WORKDIR /usr/share/nginx/html/fileplanupload
COPY /dist/alfresco-digital-workspace /usr/share/nginx/html/fileplanupload

#now copy python files
WORKDIR /python-app
COPY /libs/python .

RUN pip3 install -r requirements.txt --break-system-packages

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]


# RUN sleep 10
# RUN service nginx start

# CMD ["python3", "app.py"]