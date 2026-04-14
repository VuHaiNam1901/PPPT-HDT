import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: true, // Use this if you're on Azure
    trustServerCertificate: true, // Change to false for production
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getDb() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

export { sql };
