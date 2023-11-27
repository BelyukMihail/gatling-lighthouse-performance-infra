FROM influxdb

COPY user_script/create-lighthouse-bucket.sh /docker-entrypoint-initdb.d
RUN chmod +x /docker-entrypoint-initdb.d/create-lighthouse-bucket.sh

ENTRYPOINT ["/entrypoint.sh"]