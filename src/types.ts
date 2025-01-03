export type File = {
    fileName: string;
    accessDirective: Directive;
}

export type Directive = {
    image: string;
    x: Array<string | number>
}

export type ClassifedData = {
    p1: string;
    p2: string;
    p5: string
}

export type Task = { id: string; bookUrl: string; bookTitle: string; errorPageList?: number[], status: "pending" | "downloading" | "done" | "error" | "fatal" };

export type AppConfig = {
    multiThreadFetch?: number;
    locale?: "en" | "zh-CN";
}