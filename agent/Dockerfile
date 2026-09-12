FROM docker.io/woodpeckerci/woodpecker-agent:v3.18-alpine

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/healthz || exit 1

ENV GODEBUG=netdns=go
ENV WOODPECKER_BACKEND=local
ENV WOODPECKER_MAX_WORKFLOWS=4
