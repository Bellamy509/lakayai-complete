import fs from "fs";
import path from "path";

// Get current directory path
const ROOT = process.cwd();

const DOCKER_ENV_PATH = path.join(ROOT, "docker", ".env.docker");

const DOCKER_ENV_CONTENT =
  [
    "POSTGRES_URL=postgres://your_username:your_password@postgres:5432/your_database_name",
    "POSTGRES_DB=your_database_name",
    "POSTGRES_USER=your_username",
    "POSTGRES_PASSWORD=your_password",
  ].join("\n") + "\n";

const DEFAULT_ENV_CONTENT = `# === LakayAI Environment Configuration ===
# Auto-generated .env file

# === LLM Provider API Keys ===
# Add your API keys here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# === Authentication ===
BETTER_AUTH_SECRET=your_32_character_secret_here
BETTER_AUTH_URL=http://localhost:3000

# === Database ===
POSTGRES_URL=postgres://username:password@localhost:5432/lakayai_db

# === MCP Configuration ===
FILE_BASED_MCP_CONFIG=false

# === Development ===
NODE_ENV=development
`;

/**
 * Copy .env.example to .env if .env doesn't exist
 */
function copyEnvFile() {
  const envPath = path.join(ROOT, ".env");
  const envExamplePath = path.join(ROOT, ".env.example");

  if (!fs.existsSync(envPath)) {
    try {
      if (fs.existsSync(envExamplePath)) {
        console.warn(".env file not found. Copying from .env.example...");
        fs.copyFileSync(envExamplePath, envPath);
        console.log(".env file has been created from .env.example.");
      } else {
        console.warn(".env and .env.example files not found. Creating default .env...");
        fs.writeFileSync(envPath, DEFAULT_ENV_CONTENT, "utf-8");
        console.log(".env file has been created with default values.");
      }
      console.warn(
        "Important: You may need to edit the .env file to set your API keys.",
      );
    } catch (error) {
      console.error("Error occurred while creating .env file.");
      console.error(error);
      return false;
    }
  } else {
    console.info(".env file already exists. Skipping...");
  }

  if (!fs.existsSync(DOCKER_ENV_PATH)) {
    try {
      // Ensure docker directory exists
      const dockerDir = path.join(ROOT, "docker");
      if (!fs.existsSync(dockerDir)) {
        fs.mkdirSync(dockerDir, { recursive: true });
      }
      fs.writeFileSync(DOCKER_ENV_PATH, DOCKER_ENV_CONTENT, "utf-8");
      console.log("/docker/.env.docker file has been created.");
    } catch (error) {
      console.error("Error occurred while creating /docker/.env.docker file.");
      console.error(error);
      return false;
    }
  } else {
    console.info("/docker/.env.docker file already exists. Skipping...");
  }

  return true;
}

// Execute copy operation
const result = copyEnvFile();
process.exit(result ? 0 : 1);
