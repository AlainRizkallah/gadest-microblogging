import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    let { url } = req.query;

    let image = await getImageBase64(url);

    res.status(200).json({
      image,
    });
  } catch (error) {
    res.status(500).json({
      error: JSON.stringify(error),
    });
  }
}

let getImageBase64 = async (url : any) => {
  let cachedImage = await getCachedImage(url);
  if (cachedImage) return cachedImage;

  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(url);
  let image : any = await page.screenshot({ encoding: "base64" });
  await browser.close();

  await cacheImage(url, image);

  return image;
};

let getCachedImage = async (url : string) => {
  const response = await prisma.imageCache.findUnique({ where: { url } });
  return response?.image;
};

let cacheImage = async (url : string, image : string) => {
  await prisma.imageCache.create({ data: { url, image } });
};
