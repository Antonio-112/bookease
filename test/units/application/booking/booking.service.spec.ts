import { Test } from '@nestjs/testing';
import { IBookingRepository } from 'src/domain/booking/interfaces/booking.repository';
import { IUserRepository } from 'src/domain/user/interfaces/user.repository';
import { mock } from 'jest-mock-extended';
import { BookingService } from '../../../../src/application/booking/booking.service';
import { Booking, BookingStatus } from '../../../../src/domain/booking/booking.entity';
import {
  CreateBookingCommand,
  DeleteBookingCommand,
} from '../../../../src/application/booking/cqrs/commands';
import { User } from '../../../../src/domain/user/user.entity';
import {
  GetBookingQuery,
  GetBookingsQuery,
} from '../../../../src/application/booking/cqrs/queries';
import { IBookingServiceRepository } from '../../../../src/domain/booking-service/interfaces/booking-service.repository';
import { ConfigService } from '@nestjs/config';

describe('BookingService', () => {
  let bookingService: BookingService;
  const mockBookingRepository = mock<IBookingRepository>();
  const mockUserRepository = mock<IUserRepository>();
  const mockBookingServiceRepository = mock<IBookingServiceRepository>();

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'ATTENTION_START_TIME':
          return 9;
        case 'ATTENTION_END_TIME':
          return 17;
        case 'ATTENTION_INTERVAL':
          return 1;
        default:
          return null;
      }
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: 'IBookingRepository', useValue: mockBookingRepository },
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IBookingServiceRepository', useValue: mockBookingServiceRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isTimeSlotAvailable', () => {
    it('debería devolver true cuando el intervalo de tiempo está disponible', async () => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const hairdresser = 'Test Hairdresser';

      mockBookingRepository.findByHairdresserAndTimeRange.mockResolvedValue([]);

      const result = await bookingService.isTimeSlotAvailable(date, hairdresser);

      expect(mockBookingRepository.findByHairdresserAndTimeRange).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería devolver false cuando el intervalo de tiempo no está disponible', async () => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const hairdresser = 'Test Hairdresser';

      const existingBooking = new Booking(
        '1',
        'Test Name',
        date,
        hairdresser,
        BookingStatus.CONFIRMED,
        [],
        0,
        0,
        '',
        '',
      );

      mockBookingRepository.findByHairdresserAndTimeRange.mockResolvedValue([existingBooking]);

      const result = await bookingService.isTimeSlotAvailable(date, hairdresser);

      expect(mockBookingRepository.findByHairdresserAndTimeRange).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('debería devolver false cuando el horario está fuera del horario comercial', async () => {
      const date = new Date();
      date.setHours(8, 0, 0, 0); // Antes de las 9 AM
      const hairdresser = 'Test Hairdresser';

      const result = await bookingService.isTimeSlotAvailable(date, hairdresser);

      expect(result).toBe(false);
    });
  });

  describe('createBooking', () => {
    it('should create a new booking and return the result', async () => {
      const createBookingDto = {
        name: 'Test Name',
        date: new Date(),
        hairdresser: 'Test Hairdresser',
        status: BookingStatus.CONFIRMED,
        price: 0,
        duration: 0,
        service: [],
        note: '',
        phoneNumber: '',
      };

      const user = new User('', 'Test Name', 'test@email.com', 'test-password');

      const command = new CreateBookingCommand(createBookingDto);

      const id = '1';
      const expectedResult = new Booking(
        id,
        createBookingDto.name,
        createBookingDto.date,
        createBookingDto.hairdresser,
        createBookingDto.status,
        createBookingDto.service,
        createBookingDto.price,
        createBookingDto.duration,
        createBookingDto.note,
        createBookingDto.phoneNumber,
      );

      jest.spyOn(bookingService, 'isTimeSlotAvailable').mockResolvedValue(true);
      mockBookingRepository.create.mockResolvedValue(expectedResult);
      mockUserRepository.findByName.mockResolvedValue(user);

      const result = await bookingService.createBooking(command);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith(createBookingDto.name);
      expect(mockBookingRepository.create).toHaveBeenCalledWith(expect.any(Booking));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getBookings', () => {
    it('should return all bookings', async () => {
      const expectedResult: Booking[] = [
        new Booking(
          '1',
          'Test Name 1',
          new Date(),
          'Test Hairdresser',
          BookingStatus.CONFIRMED,
          [],
          0,
          0,
          '',
          '',
        ),
        new Booking(
          '2',
          'Test Name 2',
          new Date(),
          'Test Hairdresser',
          BookingStatus.CONFIRMED,
          [],
          0,
          0,
          '',
          '',
        ),
      ];

      mockBookingRepository.findAll.mockResolvedValue(expectedResult);

      const result = await bookingService.getBookings(new GetBookingsQuery());

      expect(mockBookingRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getBooking', () => {
    it('should return a booking with the given id', async () => {
      const id = '1';
      const expectedResult = new Booking(
        id,
        'Test Name',
        new Date(),
        'Test Hairdresser',
        BookingStatus.CONFIRMED,
        [],
        0,
        0,
        '',
        '',
      );

      mockBookingRepository.findById.mockResolvedValue(expectedResult);

      const result = await bookingService.getBooking(new GetBookingQuery(id));

      expect(mockBookingRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  /*   describe('updateBooking', () => {
    it('should update the booking with the given id and payload and return the result', async () => {
      const id = '1';
      const updateBookingDto = {
        name: 'Updated Test Name',
        date: new Date('2023-04-11T09:00:00.000Z'),
        hairdresser: 'Updated Test Hairdresser',
        status: 'cancelled',
      };

      const mockUser = new User(
        '1',
        'Updated Test Name',
        'example@example.com',
        'password',
      );
      const expectedResult = new Booking(
        id,
        updateBookingDto.name,
        updateBookingDto.date,
        updateBookingDto.hairdresser,
        updateBookingDto.status,
      );

      mockBookingRepository.update.mockResolvedValue(expectedResult);
      mockBookingRepository.findById.mockResolvedValue(expectedResult);
      mockUserRepository.findByName.mockResolvedValue(mockUser);

      const result = await bookingService.updateBooking(
        new UpdateBookingCommand(id, updateBookingDto),
      );

      expect(mockBookingRepository.update).toHaveBeenCalledWith(
        id,
        expectedResult,
      );
      expect(result).toEqual(expectedResult);
    });
  });
 */
  describe('deleteBooking', () => {
    it('should delete the booking with the given id', async () => {
      const id = '1';

      mockBookingRepository.delete.mockResolvedValue();

      await bookingService.deleteBooking(new DeleteBookingCommand(id));

      expect(mockBookingRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
