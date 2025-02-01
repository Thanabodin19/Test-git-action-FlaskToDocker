import { NextResponse } from "next/server";

const credentials = btoa(`airflow:airflow`);

interface FetchRequestInit extends RequestInit {
  duplex?: string;
}

interface Payload {
  dag_id: string;
}

export const POST = async (req: Request) => {
  try {
    const payload: Payload = await req.json();

    const response = await fetch(
      `http://localhost:8080/api/v1/dags/${payload.dag_id}/dagRuns`,
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({}),
        duplex: "half",
      } as FetchRequestInit
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to trigger DAG", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { message: "DAG triggered successfully", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error },
      { status: 500 }
    );
  }
};
