import { registerAs } from "@nestjs/config";

export const EnvConfiguration = registerAs('postgres', () => ({
    environment: process.env.NODE_ENV || 'dev',
    postgresuri: process.env.POSTGRES_URI,
    port: process.env.PORT || 3002
}));