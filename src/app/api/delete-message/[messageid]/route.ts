import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {MessageModel, UserModel} from "@/models/user";
import {User} from "next-auth"
import { JsonResponse } from "@/lib/helpers";
import { AxiosError } from "axios";

interface Errormsg extends AxiosError {
    message : string
}

export async function DELETE (request : Request , {params} : {params : {messageid : string}}) {
    const messageid = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    // Check if the user is authenticated
    if(!session || !user) {
        return JsonResponse("You are not authenticated", false, 401);
    }

    try {
        // Delete the message from the Message collection
        const deletedMessage = await MessageModel.findByIdAndDelete(messageid);

        if (!deletedMessage) {
            return JsonResponse("Message not found", false, 404);
        }

        // Remove the message reference from the user's messages array
        await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $pull: { messages: messageid } }
        );

        return JsonResponse("Message has been deleted", true, 200);
    } catch (error) {
        const errorMsg = error as Errormsg;
        console.log("Error in deleting a message", errorMsg.message);
        return JsonResponse("Error deleting messages", false, 500);
    }
}


