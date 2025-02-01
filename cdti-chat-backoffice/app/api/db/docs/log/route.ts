import { NextResponse } from "next/server";
import * as Yup from "yup";
import { connectDB } from "@/utils/db/mongodb";
import Docs from "@/models/doc";

interface ContentType {
  topic: string;
  header: string;
  desc: string;
  startDate: string;
  endDate: string;
}

interface DocData {
  file_name: string;
  folder: string;
  content: ContentType;
}

const contentSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  header: Yup.string().required("Header is required"),
  desc: Yup.string().required("Description is required"),
  startDate: Yup.string().required("StartDate is required"),
  endDate: Yup.string().required("EndDate is required"),
});

const docSchema = Yup.object().shape({
  file_name: Yup.string().required("File name is required"),
  folder: Yup.string().required("Folder is required"),
  content: contentSchema.required("Content is required"),
});

export const POST = async (request: Request) => {
  try {
    const body: DocData = await request.json();
    try {
      const { file_name, folder, content } = await docSchema.validate(body, {
        abortEarly: false,
      });
      const logData = {
        filename: file_name,
        folder,
        ...content,
      };

      await connectDB();
      const newDoc = new Docs(logData);
      const doc = await newDoc.save();

      return NextResponse.json(
        {
          message: `${folder} log is created successfully`,
          data: doc,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: `User cannot be created ${error}` },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectDB();
    const docs = await Docs.find();
    const filterDocs = docs.map(
      (
        { _id, filename, folder, topic, header, startDate, endDate, desc },
        idx
      ) => ({
        _id,
        key: idx,
        filename,
        folder,
        topic,
        header,
        startDate,
        endDate,
        desc,
      })
    );
    return NextResponse.json(
      {
        message: "Get Docs successfully",
        data: filterDocs,
        total: filterDocs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Cannot get docs ${error}` },
      { status: 500 }
    );
  }
};
