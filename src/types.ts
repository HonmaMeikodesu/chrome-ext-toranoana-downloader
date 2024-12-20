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

export type Task = { bookUrl: string; bookTitle: string; errorPageList?: number[], status: "pending" | "downloading" | "done" | "error" };