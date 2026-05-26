import mongoose, { Document, Schema } from "mongoose";
import { SlotEntity } from "domain/entities/SlotEntity";

export interface ISlot extends Document, SlotEntity { }

const TimeRangeSchema = new Schema(
    {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const DayAvailabilitySchema =
    new Schema(
        {
            enabled: {
                type: Boolean,
                required: true,
                default: false
            },
            slots: {
                type: [TimeRangeSchema],
                default: []
            }
        },
        {
            _id: false
        }
    );

const SlotSchema =
    new Schema<ISlot>(
        {
            trainerId: {
                type: String,
                ref: "Trainer",
                required: true,
                unique: true
            },
            weeklyAvailability: {
                monday: DayAvailabilitySchema,
                tuesday: DayAvailabilitySchema,
                wednesday: DayAvailabilitySchema,
                thursday: DayAvailabilitySchema,
                friday: DayAvailabilitySchema,
                saturday: DayAvailabilitySchema,
                sunday: DayAvailabilitySchema
            }
        },
        {
            timestamps: true
        }
    );

SlotSchema.loadClass(SlotEntity);

export const SlotModel =
    mongoose.model<ISlot>(
        "Slot",
        SlotSchema
    );