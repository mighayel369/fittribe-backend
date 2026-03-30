
import 'reflect-metadata';
import 'dotenv/config';
import logger from 'utils/logger';
import 'infrastructure/config/container'; 
import server from "./app";
import { connectDB } from "infrastructure/config/database";
import { passportSet } from "infrastructure/config/passportConfig";
import { SocketService } from 'infrastructure/services/SocketService';
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();
        SocketService.init(server);
        const passportConfigured = await passportSet();
        if (!passportConfigured) {
            logger.error("❌ Failed to configure Passport strategies.");
            process.exit(1);
        }

        server.listen(PORT, () => {
            logger.info(`✅ Server & Sockets running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("❌ Critical: Server startup failed", error);
        process.exit(1);
    }
}

startServer();