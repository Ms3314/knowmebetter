import mongoose , {Schema , Document} from "mongoose";

// Message Interface & Schema
export interface Message extends Document {
    content: string;
    createdAt: Date;
    userId: mongoose.Types.ObjectId; // Reference to the User
}

export const MessagaSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: { // This will link the message to a user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// User Interface & Schema
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    verifyCode: {
        type: String,
        required: [true, "VerifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
        default: Date.now
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

// Models
export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", MessagaSchema);
