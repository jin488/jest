import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import * as request from 'supertest';
import { NotebooksModule } from '../src/notebooks/notebooks.module';
import { Notebook } from '../src/notebooks/entities/notebook.entity';
import { DataSource } from 'typeorm';

describe('Notebooks E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,      //limpia entre ejecuciones
          entities: [Notebook],
          synchronize: true,
        }),
        NotebooksModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/GET notebooks (debería devolver una lista vacía)', async () => {
    const res = await request(app.getHttpServer()).get('/notebooks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('/POST notebooks (debería crear una notebook)', async () => {
    const dto = { title: 'Mi primera notebook', content: 'Contenido de prueba' };

    const res = await request(app.getHttpServer())
      .post('/notebooks')
      .send(dto)
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: dto.title,
      content: dto.content,
    });

    const all = await request(app.getHttpServer()).get('/notebooks');
    expect(all.body.length).toBe(1);
  });
});
