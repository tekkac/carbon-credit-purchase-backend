import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { IStockService } from './stock.interface';
import { Stock } from './entities/stock.entity';
import { PrismaService } from 'nestjs-prisma';
import { monotonicFactory } from 'ulid';
import { AvailableStockDto } from './dto/available-stock.dto';

@Injectable()
export class StockService implements IStockService {
  constructor(private prisma: PrismaService) {}

  create(projectId: string, createStockDto: CreateStockDto): Promise<Stock> {
    const ulid = monotonicFactory();
    return this.prisma.carbonCredit.create({
      data: {
        id: ulid().toString(),
        ...createStockDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(): Promise<Stock[]> {
    return this.prisma.carbonCredit.findMany();
  }

  findOne(id: string): Promise<Stock> {
    return this.prisma.carbonCredit.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.prisma.carbonCredit.update({
      where: { id },
      data: updateStockDto,
    });
  }

  async remove(id: string): Promise<string> {
    await this.prisma.carbonCredit.delete({ where: { id } });
    return id;
  }

  async availableStock(): Promise<AvailableStockDto> {
    const count = await this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
      },
    });
    return { count };
  }
}
