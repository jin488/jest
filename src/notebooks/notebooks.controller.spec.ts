import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { Notebook } from './entities/notebook.entity';
import { CreateNotebookDto } from './dto/create-notebook.dto';

describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  const mockNotebooksService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        {
          provide: NotebooksService,
          useValue: mockNotebooksService, // Agrego el mock del servicio
        }],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });  

  //! TEST 1

  it('deberia devolder todas las notebooks', async () => {
    const mockNotebooks: Notebook[] = [
      {id: 1, title: 'Test Notebook', content:'Hola'}
    ];

    mockNotebooksService.findAll.mockResolvedValue(mockNotebooks); //Define el valor que retornará la promesa del mock

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled() //Verifica que el método del servicio fue llamado
    expect(result).toEqual(mockNotebooks); // Verifica que el resultado devuelto es correcto
  });

   //! TEST 2

   it('deberia crear una notebook', async () => {
    const dto: CreateNotebookDto = {title: 'Nueva', content: 'Contenido'};
    const mockNotebooks: Notebook = {id: 1, ...dto}

    mockNotebooksService.create.mockResolvedValue(mockNotebooks);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto); // Verifica que se llamó con el DTO correcto
    expect(result).toEqual(mockNotebooks); // Verifica el resultado
   })
});
