export interface SessionData {
  name: string;
  email: string;
  role: string;
}

export interface FoldersData {
  status: number;
  data: {
    folder: string;
    file_name: string;
    data: string[];
  };
  total: number;
}

export interface Doc {
  _id: any;
  key: number;
  filename: string;
  folder: string;
  topic: string;
  header: string;
  startDate: string;
  endDate: string;
  desc: string;
}

export interface DocsData {
  message: number;
  data: Doc[];
  total: number;
}

export interface DocData {
  message: number;
  data: Doc;
}

export interface DocDataUpdate {
  message: number;
  data: Doc;
}

export interface BasePageProps {
  session: SessionData | undefined;
}

export interface PromptInput {
  prompt: string;
}
