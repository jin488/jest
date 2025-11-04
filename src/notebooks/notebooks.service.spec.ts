import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateNotebookDto } from './dto/create-notebook.dto';

describe('NotebooksService', () => {
  let service: NotebooksService;
  let notebookRepo: jest.Mocked<Repository<Notebook>>; // mockeo el repositorio

  beforeEach(async () => {
    // creo un mock del repositorio
    const mockRepository = {
      find: jest.fn(), // Crea funciones falsas que podemos controlar y verificar
      create: jest.fn(),
      save: jest.fn(),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook), // proveer el token del repositorio para el mock
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
    notebookRepo = module.get(getRepositoryToken(Notebook))
  });

  afterEach(() => {
    jest.clearAllMocks(); // limpio los mocks despues de cada test
  });

  //! Tests 1

  it('deberia devolver todas las notebooks del (findAll)', async () => {
    const mockNotebooks: Notebook[] = [
      { id: 1, title: 'Notebook 1', content: 'Content 1' },
      { id: 2, title: 'Notebook 2', content: 'Content 2' },
    ];
    notebookRepo.find.mockResolvedValue(mockNotebooks); // mockear el metodo find

  const result = await service.findAll();
    expect(notebookRepo.find).toHaveBeenCalledTimes(1); // verificar que se llamo al metodo find una vez
    expect(result).toEqual(mockNotebooks); // verificar el resultado
  });

  //! Tests 2

  it('deberia crear una nueva notebook (create) y guardarla', async () => {
    const dto: CreateNotebookDto = { title: 'nueva Notebook', content: 'nuevo Contenido' };
    const mockNotebook: Notebook = { id: 1, ...dto };

    // simulamos los métodos del repo
    notebookRepo.create.mockReturnValue(mockNotebook); // Devuelve un valor directamente (para funciones no async)
    notebookRepo.save.mockResolvedValue(mockNotebook); // Simula una promesa que devuelve un valor (para métodos async)


    const result = await service.create(dto);

    expect(notebookRepo.create).toHaveBeenCalledWith(dto); // verificar que se llamo a create con el dto
    expect(notebookRepo.save).toHaveBeenCalledWith(mockNotebook); // verificar que se llamo a save con la notebook creada
    expect(result).toEqual(mockNotebook); // verificar el resultado
  });
});
