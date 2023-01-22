import mongoose from "../db/connection";
import { Document, Schema } from "mongoose";

// crio uma interface que extende a interface document do mongoose
/*
interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
} 
*/

// Outro método para criar novos tipos de documento usando o & para extender os tipos de documents de Document
type UserDoc = {
  name: string;
  email: string;
  password: string | undefined;
} & Document;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//especifíco que o modelo criado pela função model vai manipular documentos do tipo da interface UserDoc
const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
export { UserDoc };
