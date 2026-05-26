
import { Socket } from "socket.io";
import { singleton } from "tsyringe";
import logger from "logger";

@singleton()
export class VideoCallHandler {
    private logger = logger;

    private activeSessions = new Map<string, Set<string>>();

    public registerEvents(socket: Socket, userId: string): void {

        socket.on("join_video_session", ({ bookingId }) => {
            socket.join(`video_${bookingId}`);

            if (!this.activeSessions.has(bookingId)) {
                this.activeSessions.set(bookingId, new Set());
            }
            this.activeSessions.get(bookingId)?.add(socket.id);


            socket.to(`video_${bookingId}`).emit("peer_joined_video", { senderId: userId });
            this.logger.info(`🎥 User ${userId} joined video room for booking: ${bookingId}`);
        });

        socket.on("video_offer", ({ bookingId, sdp }) => {
            socket.to(`video_${bookingId}`).emit("video_offer_received", { sdp, senderId: userId });
        });


        socket.on("video_answer", ({ bookingId, sdp }) => {
            socket.to(`video_${bookingId}`).emit("video_answer_received", { sdp });
        });

        socket.on("video_ice_candidate", ({ bookingId, candidate }) => {
            socket.to(`video_${bookingId}`).emit("video_ice_candidate_received", { candidate });
        });


        socket.on("leave_video_session", ({ bookingId }) => {
            this.cleanUpSession(socket, bookingId, userId);
        });


        socket.on("disconnect", () => {
            for (const [bookingId, participants] of this.activeSessions.entries()) {
                if (participants.has(socket.id)) {
                    this.cleanUpSession(socket, bookingId, userId);
                }
            }
        });
    }

    private cleanUpSession(socket: Socket, bookingId: string, userId: string): void {
        socket.leave(`video_${bookingId}`);
        const participants = this.activeSessions.get(bookingId);
        if (participants) {
            participants.delete(socket.id);
            if (participants.size === 0) {
                this.activeSessions.delete(bookingId);
            }
        }
        socket.to(`video_${bookingId}`).emit("peer_left_video");
        this.logger.info(`🛑 User ${userId} left video room for booking: ${bookingId}`);
    }
}