
import { IChatRepo } from "domain/repositories/IChatRepo";
import { BaseRepository } from "./BaseRepository";
import { ChatDocument, ChatModel } from "../models/ChatModel";
import { ChatEntity } from "domain/entities/ChatEntity";
import { Model } from "mongoose";
import { ChatMapper } from "../mappers/ChatMapper";
import crypto from "crypto";

export class ChatRepoImpl extends BaseRepository<ChatDocument, ChatEntity> implements IChatRepo {
    protected model: Model<ChatDocument> = ChatModel;

    protected toEntity(doc: ChatDocument): ChatEntity {
        return ChatMapper.toEntity(doc);
    }

    async establishChat(data: ChatEntity): Promise<ChatEntity> {
        let doc = await this.model.create(data)
        return this.toEntity(doc)
    }

    async getChatListForTrainer(trainerId: string, searchQuery: string = ""): Promise<any[]> {
        const pipeline: any[] = [
            { $match: { participants: trainerId, isActive: true } },
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "messageId",
                    as: "lastMsg"
                }
            },
            { $unwind: { path: "$lastMsg", preserveNullAndEmptyArrays: true } },
            { $addFields: { clientId: { $filter: { input: "$participants", as: "p", cond: { $ne: ["$$p", trainerId] } } } } },
            { $unwind: "$clientId" },
            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "userId",
                    as: "clientInfo"
                }
            },
            { $unwind: "$clientInfo" }
        ];

        if (searchQuery) {
            pipeline.push({
                $match: {
                    "clientInfo.name": { $regex: searchQuery, $options: "i" }
                }
            });
        }

        return await this.model.aggregate(pipeline);
    }

async getChatListForUser(userId: string, searchQuery: string = ""): Promise<any[]> {
    const pipeline: any[] = [
        { $match: { participants: userId, isActive: true } },
        {
            $lookup: {
                from: "messages",
                localField: "lastMessage",
                foreignField: "messageId",
                as: "lastMsg"
            }
        },
        { $unwind: { path: "$lastMsg", preserveNullAndEmptyArrays: true } },
        { $addFields: { trainerId: { $filter: { input: "$participants", as: "p", cond: { $ne: ["$$p", userId] } } } } },
        { $unwind: "$trainerId" },
        {
            $lookup: {
                from: "trainers",
                localField: "trainerId",
                foreignField: "trainerId",
                as: "trainerInfo"
            }
        },
        { $unwind: "$trainerInfo" }
    ];

    if (searchQuery) {
        pipeline.push({
            $match: {
                "trainerInfo.name": { $regex: searchQuery, $options: 'i' }
            }
        });
    }

    return await this.model.aggregate(pipeline);
}

    async getChatId(senderId: string, receiverId: string): Promise<string | null> {
        const chat = await this.model.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        return chat ? chat.chatId : null;
    }


    async updateChat(chatId: string, data: ChatEntity): Promise<void> {
        console.log('updating data', data)
        const persistenceData = ChatMapper.toDocument(data);

        await this.model.findOneAndUpdate(
            { chatId },
            { $set: persistenceData },
            { new: true }
        );
    }

    async findById(chatId: string): Promise<ChatEntity | null> {
        const result = await this.model.aggregate([
            { $match: { chatId: chatId } },
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "messageId",
                    as: "lastMessageDetails"
                }
            },
            {
                $unwind: {
                    path: "$lastMessageDetails",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        if (!result || result.length === 0) {
            return null;
        }
        return ChatMapper.toEntity(result[0]);
    }
}