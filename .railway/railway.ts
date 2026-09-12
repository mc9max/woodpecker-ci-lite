import { defineRailway, github, image, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const woodpeckerCiLite = github("mc9max/woodpecker-ci-lite", { branch: "master", checkSuites: false });

  const woodpeckerServerVolume = volume("woodpecker-server-volume", {
    alerts: { usage: { "100": {}, "80": {}, "95": {} } },
    allowOnlineResize: true,
    region: "us-west2",
    sizeMB: 5000
  });

  const agent = service("agent", {
    source: woodpeckerCiLite,
    build: { dockerfilePath: "agent/Dockerfile" },
    replicas: { "us-west2": 1 },
    env: {
      WOODPECKER_AGENT_SECRET: preserve(),
      WOODPECKER_BACKEND: preserve(),
      WOODPECKER_GRPC_SECRET: preserve(),
      WOODPECKER_LOG_LEVEL: preserve(),
      WOODPECKER_SERVER: preserve()
    },
  });

  const woodpeckerServer = service("woodpecker-server", {
    source: woodpeckerCiLite,
    build: { dockerfilePath: "server/Dockerfile" },
    deploy: { healthcheckPath: "/healthz" },
    replicas: { "us-west2": 1 },
    volumeMounts: { "/var/lib/woodpecker": woodpeckerServerVolume },
    env: {
      PORT: preserve(),
      RAILWAY_RUN_UID: preserve(),
      WOODPECKER_ADMIN: preserve(),
      WOODPECKER_AGENT_SECRET: preserve(),
      WOODPECKER_DATABASE_DATASOURCE: preserve(),
      WOODPECKER_DATABASE_DRIVER: preserve(),
      WOODPECKER_GITHUB: preserve(),
      WOODPECKER_GITHUB_CLIENT_ID: preserve(),
      WOODPECKER_GITHUB_CLIENT_SECRET: preserve(),
      WOODPECKER_GRPC_ADDR: preserve(),
      WOODPECKER_GRPC_SECRET: preserve(),
      WOODPECKER_HOST: preserve(),
      WOODPECKER_LOG_LEVEL: preserve(),
      WOODPECKER_OPEN: preserve()
    },
  });

  return project("woodpecker-ci-lite", {
    resources: [agent, woodpeckerServer, woodpeckerServerVolume],
  });
});
