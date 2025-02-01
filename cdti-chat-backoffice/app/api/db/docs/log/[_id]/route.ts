import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db/mongodb";
import Docs from "@/models/doc";
import * as Yup from "yup";

interface ContentType {
  topic: string;
  header: string;
  desc: string;
  startDate: string;
  endDate: string;
}

interface DocDataUpdate {
  content: ContentType;
}

const contentSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  header: Yup.string().required("Header is required"),
  desc: Yup.string().required("Description is required"),
  startDate: Yup.string().required("StartDate is required"),
  endDate: Yup.string().required("EndDate is required"),
});

const docUpdateSchema = Yup.object().shape({
  content: contentSchema.required("Content is required"),
});

export const GET = async (
  request: Request,
  { params }: { params: { _id: string } }
) => {
  try {
    await connectDB();
    const { _id } = await params;
    const doc = await Docs.findOne({ _id });
    if (!doc) {
      return NextResponse.json(
        { message: `Document with filename "${_id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Get Document successfully",
        data: doc,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Cannot get document: ${error}` },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { _id: string } }
) => {
  try {
    const body: DocDataUpdate = await request.json();

    const { content } = await docUpdateSchema.validate(body, {
      abortEarly: false,
    });

    const updateDoc = {
      $set: {
        ...content,
      },
    };

    await connectDB();
    const { _id } = await params;
    const filter = { _id };
    const doc = await Docs.updateOne(filter, updateDoc);
    if (doc.modifiedCount === 0) {
      return NextResponse.json(
        { message: `Document with filename "${_id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Update Document successfully",
        data: doc,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Cannot get document: ${error}` },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { _id: string } }
) => {
  try {
    await connectDB();
    const { _id } = await params;
    const query = { _id };
    const doc = await Docs.deleteOne(query);
    if (doc.deletedCount === 0) {
      return NextResponse.json(
        { message: `Document with filename "${_id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Delete Document successfully",
        data: doc,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Cannot get document: ${error}` },
      { status: 500 }
    );
  }
};
