FROM docker.io/woodpeckerci/woodpecker-server:v3.18-alpine

RUN mkdir -p /var/lib/woodpecker && chown -R 1000:1000 /var/lib/woodpecker

VOLUME /var/lib/woodpecker

EXPOSE 8000 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/healthz || exit 1

ENV GODEBUG=netdns=go
ENV WOODPECKER_DATABASE_DRIVER=sqlite3
ENV WOODPECKER_DATABASE_DATASOURCE=/var/lib/woodpecker/woodpecker.sqlite
