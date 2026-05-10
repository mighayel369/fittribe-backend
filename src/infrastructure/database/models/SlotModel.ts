import mongoose, { Document, Schema } from "mongoose";
import { SlotEntity } from "domain/entities/SlotEntity";

export interface ISlot extends Document, SlotEntity { }


const TimeRangeSchema = new Schema(
    {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    { _id: false }
);


const SlotSchema = new Schema<ISlot>(
    {
        trainerId: {
            type: String,
            ref: "Trainer",
            required: true,
            unique: true
        },

        weeklyAvailability: {
            monday: { type: [TimeRangeSchema], default: [] },
            tuesday: { type: [TimeRangeSchema], default: [] },
            wednesday: { type: [TimeRangeSchema], default: [] },
            thursday: { type: [TimeRangeSchema], default: [] },
            friday: { type: [TimeRangeSchema], default: [] },
            saturday: { type: [TimeRangeSchema], default: [] },
            sunday: { type: [TimeRangeSchema], default: [] }
        }
    },
    {
        timestamps: true
    }
);

SlotSchema.loadClass(SlotEntity)

export const SlotModel = mongoose.model<ISlot>("Slot", SlotSchema);