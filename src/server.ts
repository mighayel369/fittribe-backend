
import 'reflect-metadata';
import 'dotenv/config';
import logger from 'utils/logger';
import 'infrastructure/config/container';
import { container } from "tsyringe";
import { I_SOCKET_SERVICE_TOKEN, ISocketService } from 'domain/services/i-socket-service';
import server from "./app";
import { connectDB } from "infrastructure/config/database";
import { passportSet } from "infrastructure/config/passportConfig";
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await connectDB();
        console.log("2. Initializing Sockets...");
        const socketService = container.resolve<ISocketService>(I_SOCKET_SERVICE_TOKEN);
        socketService.init(server);
        
        const passportConfigured = await passportSet(); 
        server.listen(PORT, () => {
            logger.info(`✅ Server & Sockets running on port ${PORT}`);
        });
    } catch (error) { console.log(error) }
}

startServer();