FROM ghcr.io/woodpeckerci/woodpecker-agent:3.18

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/healthz || exit 1

ENV GODEBUG=netdns=go
ENV WOODPECKER_BACKEND=local
ENV WOODPECKER_MAX_WORKFLOWS=4
