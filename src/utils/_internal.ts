import { XMLParser } from "fast-xml-parser";
import { ClassifedData } from "../types";

export type BookInfo = {
	contentType: string;
	// indicate whether the book has cover
	cover: string;
}

export type HeaderInfo = {
    num: number;
    pgs: {
        pg: Array<{
			// n and id should be equal
			n: number;
			id: number;
            img: string;
            x: string
        }>
    }
}
export type BookAll = {
	bookInfo: BookInfo
    hi: HeaderInfo
}

function __getRandom() {
	const n = 9999999999;
	return Math.floor(Math.random() * n);
}

export async function __urlInfo(viewerData: ClassifedData) {
    
    const { p1, p2, p5} = viewerData;

	// user id
	const userid = p1;

	// get xml
    const xml = await __xmlInfo({ p1, p2, p5 });


	const imageUrlfunc = function(img: string, drm: string) {
		const url = "https://viewer.toraebook.com/image_php73.php?sp=" + p5 + "&x1=" + img + "&x2=" + drm + "&t=" + __getRandom();
		return url;
	}

	return {
		imageUrl: imageUrlfunc,
		userid: userid,
		bookInfo: xml.bookInfo,
		headerInfo: xml.headerInfo,
	};

}

export async function __xmlInfo(viewerData: ClassifedData) {

    const { p5 } = viewerData;

	// new
	const bookallxmlurl = "https://viewer.toraebook.com/bookinfo_php73.php?" + p5;
	// important
    const res = (await fetch(bookallxmlurl, { headers: { "Accept": "application/xml" } }));
    const xc = res.headers.get("X-Error-Code");
    if (xc !== "0") {
        const xdef = res.headers.get("X-Error-def");
        throw new Error(`Unexpected error code: ${xc}, error message: ${xdef}`);
    }
    const xml = await res.text();
	const parser = new XMLParser({ ignoreAttributes: true, ignoreDeclaration: true, ignorePiTags: true });
	const bookall = parser.parse(xml).book; 
    const bookInfo: BookAll = bookall["bookInfo"];
    const headerInfo: HeaderInfo = bookall["hi"];

	return {
		bookInfo: bookInfo,
		headerInfo: headerInfo,
	};
}