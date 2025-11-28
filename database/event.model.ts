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
    mode: string;
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
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "At least one agenda item is required",
            },
        },

        organizer: { type: String, required: true, trim: true },

        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "At least one tag is required",
            },
        },
    },
    { timestamps: true }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
