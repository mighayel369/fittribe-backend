
import { IChatRepo } from "domain/repositories/IChatRepo";
import { BaseRepository } from "./BaseRepository";
import { ChatDocument, ChatModel } from "../models/ChatModel";
import { ChatEntity } from "domain/entities/ChatEntity";
import { Model, PipelineStage } from "mongoose";
import { ClientChatListType, TrainerChatListType } from "domain/repositories/types/chat-type";



export class ChatRepoImpl extends BaseRepository<ChatDocument> implements IChatRepo {
    protected model: Model<ChatDocument> = ChatModel;


    async establishChat(data: ChatEntity): Promise<ChatEntity> {
        const doc = await this.model.create(data)
        return doc
    }

    async getChatListForTrainer(trainerId: string, searchQuery = ""): Promise<TrainerChatListType[]> {
        const pipeline: PipelineStage[] = [
            { $match: { participants: trainerId, isActive: true } },

            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessageId",
                    foreignField: "messageId",
                    as: "lastMsg"
                }
            },
            { $unwind: { path: "$lastMsg", preserveNullAndEmptyArrays: true } },

            {
                $addFields: {
                    targetClientId: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "p",
                                    cond: { $ne: ["$$p", trainerId] }
                                }
                            }, 0
                        ]
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "targetClientId",
                    foreignField: "userId",
                    as: "clientDetails"
                }
            },
            { $unwind: "$clientDetails" },

            ...(searchQuery ? [{
                $match: {
                    "clientDetails.name": { $regex: searchQuery, $options: "i" }
                }
            }] : []),

            {
                $project: {
                    _id: 0,
                    chat: {
                        chatId: "$chatId",
                        isActive: "$isActive",
                        unreadCount: "$unreadCount",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt",
                    },
                    user: {
                        name: "$clientDetails.name",
                        email: "$clientDetails.email",
                        userId: "$clientDetails.userId",
                        role: "$clientDetails.role",
                        status: "$clientDetails.status",
                        profilePic: "$clientDetails.profilePic",
                    },
                    message: "$lastMsg"
                }
            }
        ];

        const results = await this.model.aggregate<TrainerChatListType>(pipeline);
        return results;
    }

    async getChatListForUser(userId: string, searchQuery = ""): Promise<ClientChatListType[]> {
        const pipeline: PipelineStage[] = [
            { $match: { participants: userId, isActive: true } },

            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessageId",
                    foreignField: "messageId",
                    as: "lastMsg"
                }
            },
            { $unwind: { path: "$lastMsg", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    targetTrainerId: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "p",
                                    cond: { $ne: ["$$p", userId] }
                                }
                            }, 0
                        ]
                    }
                }
            },

            {
                $lookup: {
                    from: "trainers",
                    localField: "targetTrainerId",
                    foreignField: "trainerId",
                    as: "trainerDetails"
                }
            },
            { $unwind: "$trainerDetails" },

            ...(searchQuery ? [{
                $match: {
                    "trainerDetails.name": { $regex: searchQuery, $options: "i" }
                }
            }] : []),

            {
                $project: {
                    _id: 0,
                    chat: {
                        chatId: "$chatId",
                        unreadCount: "$unreadCount",
                        isActive: "$isActive",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt"
                    },
                    trainer: {
                        trainerId: "$trainerDetails.trainerId",
                        name: "$trainerDetails.name",
                        email: "$trainerDetails.email",
                        role: "$trainerDetails.role",
                        verified: "$trainerDetails.verified",
                        pricePerSession: "$trainerDetails.pricePerSession",
                        profilePic: "$trainerDetails.profilePic",
                        rating: "$trainerDetails.rating",
                        experience: "$trainerDetails.experience",
                        status: "$trainerDetails.status"
                    },
                    message: "$lastMsg"
                }
            }
        ];

        return await this.model.aggregate<ClientChatListType>(pipeline);
    }

    async findChatRoom(senderId: string, receiverId: string): Promise<ChatEntity | null> {
        const chat = await this.model.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        return chat
    }


    async updateChat(chatId: string, data: ChatEntity): Promise<void> {

        await this.model.findOneAndUpdate(
            { chatId },
            { $set: data },
            { new: true }
        );
    }

    async findById(chatId: string): Promise<ChatEntity | null> {
        const doc = await this.model.findOne({ chatId })
        return doc ? doc : null
    }
}