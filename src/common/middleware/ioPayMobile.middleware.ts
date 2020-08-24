import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

declare global {
  var isIoPayMobile: boolean;
}

@Injectable()
export class IoPayMobileMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const ua = req.header["user-agent"];
    globalThis.isIoPayMobile = ua && (ua.includes("IoPayAndroid") || ua.includes("IoPayiOs"));
    next();
  }
}
