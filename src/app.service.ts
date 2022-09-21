import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async findGameAll() {
    return await this.prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    });
  }

  async getFindOneGame(gameId) {
    return this.prisma.game.findFirst({
      where: {
        id: gameId,
      },
    });
  }

  async createAds(@Body() body, id: string) {
    const gameId: string = id;
    console.log('entrou  aqui => ', body);

    const ads = await this.prisma.ad.create({
      data: {
        name: body.name,
        discord: body.discord,
        yearsPlaying: body.yearsPlaying,
        hourEnd: this.ConvertHoursForMinutes(body.hourEnd),
        hourStart: this.ConvertHoursForMinutes(body.hourStart),
        weekDays: body.weekDays.toString(),
        useVoiceChannel: body.useVoiceChannel,
        gameId,
      },
    });

    return ads;
  }

  ConvertHoursForMinutes(hourString: string) {
    const [hours, minutes] = hourString.split(':').map(Number);
    const minutesAmount = hours * 60 + minutes;
    return minutesAmount;
  }
  ConvertMinutesForHours(minutesAmount: number) {
    const hours = Math.floor(minutesAmount / 60);
    const minutes = minutesAmount % 60;
    return (
      String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0')
    );
  }

  async getListAds(gameId: string) {
    const ad = await this.prisma.ad.findMany({
      select: {
        id: true,
        name: true,
        yearsPlaying: true,
        weekDays: true,
        hourStart: true,
        hourEnd: true,
        useVoiceChannel: true,
      },
      where: {
        gameId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ad.map(
      (arr: {
        id: string;
        name: any;
        useVoiceChannel: any;
        yearsPlaying: any;
        weekDays: string;
        hourStart: number;
        hourEnd: number;
      }) => {
        return {
          id: arr.id,
          name: arr.name,
          useVoiceChannel: arr.useVoiceChannel,
          yearsPlaying: arr.yearsPlaying,
          weekDays: arr.weekDays.split(','),
          hourStart: this.ConvertMinutesForHours(arr.hourStart),
          hourEnd: this.ConvertMinutesForHours(arr.hourEnd),
        };
      },
    );
  }

  async listDiscord(id: string) {
    const ad = await this.prisma.ad.findUnique({
      select: {
        discord: true,
      },
      where: {
        id,
      },
    });
    return ad.discord;
  }
}
