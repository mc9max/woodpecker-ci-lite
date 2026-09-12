FROM woodpeckerci/woodpecker-server:v3.18.1-alpine

USER root

RUN mkdir -p /var/lib/woodpecker && chmod 777 /var/lib/woodpecker

EXPOSE 8000 9000

ENV GODEBUG=netdns=go
ENV WOODPECKER_DATABASE_DRIVER=sqlite3
ENV WOODPECKER_DATABASE_DATASOURCE=/var/lib/woodpecker/woodpecker.sqlite

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
