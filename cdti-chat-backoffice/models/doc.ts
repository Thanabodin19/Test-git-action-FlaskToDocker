import mongoose, { Schema, Document } from "mongoose";

interface Doc extends Document {
  filename: string;
  folder: string;
  topic: string;
  header: string;
  startDate: string;
  endDate: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}

const docSchema = new Schema<Doc>(
  {
    id: {
      type: String,
      require: false,
    },
    filename: {
      type: String,
      require: [true, "Filename is required"],
    },
    folder: {
      type: String,
      require: [true, "Folder is required"],
      unique: true,
    },
    topic: {
      type: String,
      require: [true, "Topic is required"],
    },
    header: {
      type: String,
      require: [true, "Header is required"],
    },
    startDate: {
      type: String,
      required: [true, "StartDate is required"],
    },
    endDate: {
      type: String,
      required: [true, "EndDate is required"],
    },
    desc: {
      type: String,
      require: [true, "Desc is required"],
    },
  },
  { timestamps: true }
);

const Docs = mongoose.models.Document || mongoose.model("Document", docSchema);
export default Docs;
