import { Schema, model, models, Document, Types } from "mongoose";

export interface IEvent extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: "online" | "offline" | "hybrid";
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, trim: true, maxlength: 100 },

        description: { type: String, required: true, trim: true, maxlength: 1000 },

        overview: { type: String, required: true, trim: true, maxlength: 500 },

        image: { type: String, required: true, trim: true },

        venue: { type: String, required: true, trim: true },

        location: { type: String, required: true, trim: true },

        date: { type: String, required: true },

        time: { type: String, required: true },

        mode: {
            type: String,
            required: true,
            enum: ["online", "offline", "hybrid"],
        },

        audience: { type: String, required: true, trim: true },

        agenda: {
            type: [String],
            required: true,
            validate: (v: string[]) => v.length > 0,
        },

        organizer: { type: String, required: true, trim: true },

        tags: {
            type: [String],
            required: true,
            validate: (v: string[]) => v.length > 0,
        },
    },
    { timestamps: true }
);

// Автоматическая конвертация ObjectId → string
EventSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_: any, ret: any) => {
        ret._id = ret._id.toString();
        return ret;
    },
});

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
