"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/user"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"  
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProp = {
    message : Message ,
    onMessageDelete : (messageId : string) => void
}


const MessageCard = ({message , onMessageDelete}:MessageCardProp) => {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        try {
            // console.log(message , 'this is the message')
        const response = await axios.post(`/api/delete-message`, {messageid : message._id})
        toast({
            title : response.data.message
        })
        // @ts-expect-error-some 
        onMessageDelete(message._id)
        } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast({
                    title : "Error" ,
                    description : axiosError.response?.data.message || "Failed to delete message" ,
                    variant :"destructive"
                })
        }
        
    }
  return (
    <Card className="w-[300px] h-[200px] overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Anonymous User</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-5 h-5 p-3" variant="destructive"><X className="w-5 h-5" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to delete this message?
                        This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent>
            <CardDescription>{message.content}</CardDescription>
        </CardContent>
    </Card>
  
  )
}

export default MessageCard
