import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/games')
  getGame() {
    return this.appService.findGameAll();
  }

  @Post('/games/:id/ads')
  async getAds(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const body = req.body;
    const gameId = id;
    const game = await this.appService.getFindOneGame(gameId);

    if (game === null) {
      return response.status(404).json({ message: 'Not Found' });
    }

    return response
      .status(201)
      .json(await this.appService.createAds(body, gameId));
  }

  @Get('/games/:id/ads')
  async getAd(@Param('id') id: string, @Res() response: Response) {
    const gameId = id;
    const ad = await this.appService.getListAds(gameId);
    console.log(ad);
    if (ad.length === 0) {
      return response.status(404).json({ message: 'Not Found' });
    }
    return response.status(200).json(ad);
  }

  @Get('/ads/:id/discord')
  async getDiscord(@Param('id') id: string, @Res() response: Response) {
    const discord = id;
    const ad = await this.appService.listDiscord(discord);

    if (ad === null || ad === undefined) {
      return response.status(404).json({ discord: '' });
    }
    return response.status(200).json({ discord: ad.discord });
  }
}
