import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { MessageModel, UserModel } from "@/models/user";
import { User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";

// Properly type the DELETE function handler
export async function POST(
  request: NextRequest
): Promise<Response> {  // Ensure the return type is Promise<Response>
  try {
    const {messageid} = await request.json();
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const deletedMessage = await MessageModel.findByIdAndDelete(messageid);

    if (!deletedMessage) {
      return new Response(
        JSON.stringify({ success: false, message: "Message not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { messages: messageid } }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Message has been deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const ErrorMessage = error as Error
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting messages"  + ErrorMessage.message}),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
