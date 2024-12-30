import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected?: number
}

const connection:ConnectionObject = {}

async function dbConnect():Promise<unknown> {
    if(connection.isConnected) {
        console.log("Already connected to the db");
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '')
        connection.isConnected = db.connections[0].readyState ;
        console.log('DB connected succesfully')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}

export default dbConnect()

//Assignment 
// check the db ke connection ku console.log karke thoda study karke dekho 