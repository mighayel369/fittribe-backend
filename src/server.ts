
import 'reflect-metadata';
import 'dotenv/config';
import logger from 'utils/logger';
import 'infrastructure/config/container';
import { container } from "tsyringe";
import { SocketService } from 'infrastructure/services/SocketService';
import server from "./app";
import { connectDB } from "infrastructure/config/database";
import { passportSet } from "infrastructure/config/passportConfig";
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();
        const socketService = container.resolve(SocketService);
        socketService.init(server);
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