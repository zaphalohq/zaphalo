import { Inject, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './cat.entity';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { DataSource, Repository } from 'typeorm';


@Injectable()
export class CatsService {
  private readonly catsRepository: Repository<Cat>;

  constructor(
    @Inject(CONNECTION) connection: DataSource,
  ) {
    this.catsRepository = connection.getRepository(Cat);
  }

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = new Cat();
    cat.name = createCatDto.name;

    return this.catsRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }
}