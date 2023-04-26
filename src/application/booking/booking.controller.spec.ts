import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { mock } from 'jest-mock-extended';
import { CreateBookingDto } from './cqrs/dtos/create-booking.dto';
import { UpdateBookingDto } from './cqrs/dtos/update-booking.dto';
import { Booking, BookingStatus } from '../../domain/booking/booking.entity';
import { UpdateBookingCommand } from './cqrs/commands/update-booking.command';
import { GetBookingQuery } from './cqrs/queries/get-booking.query';

const mockBookingService = mock<BookingService>();

describe('BookingController', () => {
  let bookingController: BookingController;
  let bookingService: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    bookingController = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(bookingController).toBeDefined();
    expect(bookingService).toBeDefined();
  });
  describe('createBooking', () => {
    it('should call createBooking with correct parameters and return the result', async () => {
      const createBookingDto: CreateBookingDto = {
        name: 'Test Name',
        date: new Date(),
        hairdresser: 'Test Hairdresser',
        status: BookingStatus.CONFIRMED,
      };

      const expectedResult = { id: '1', ...createBookingDto };
      mockBookingService.createBooking.mockResolvedValue(
        expectedResult as Booking,
      );

      const result = await bookingController.createBooking(createBookingDto);

      /* expect(bookingService.createBooking).toHaveBeenCalledWith(
        expect.(createBookingDto),
      ); */
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getBookings', () => {
    it('should call getBookings and return the result', async () => {
      const expectedResult = [
        {
          id: '1',
          name: 'Test Name 1',
          date: new Date(),
          hairdresser: 'Test Hairdresser 1',
          status: BookingStatus.CANCELLED,
        },
        {
          id: '2',
          name: 'Test Name 2',
          date: new Date(),
          hairdresser: 'Test Hairdresser 2',
          status: BookingStatus.CANCELLED,
        },
      ];

      mockBookingService.getBookings.mockResolvedValue(
        expectedResult as Booking[],
      );

      const result = await bookingController.getBookings();

      expect(mockBookingService.getBookings).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getBooking', () => {
    it('should call getBooking with correct id and return the result', async () => {
      const id = '1';

      const expectedResult = new Booking(
        id,
        'Test Name',
        new Date(),
        'Test Hairdresser',
        BookingStatus.CONFIRMED,
      );

      const getBookingQuery = new GetBookingQuery(id);
      mockBookingService.getBooking.mockReturnValue(
        Promise.resolve(expectedResult),
      );

      const result = await bookingController.getBooking(id);

      expect(mockBookingService.getBooking).toHaveBeenCalledWith(
        getBookingQuery,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateBooking', () => {
    it('should call updateBooking with correct id and payload and return the result', async () => {
      const id = '1';
      const updateBookingDto: UpdateBookingDto = {
        name: 'Updated Test Name',
        date: new Date(),
        hairdresser: 'Updated Test Hairdresser',
        status: BookingStatus.CANCELLED,
      };

      const expectedResult = new Booking(
        id,
        updateBookingDto.name,
        updateBookingDto.date,
        updateBookingDto.hairdresser,
        updateBookingDto.status,
      );

      const updateBookingCommand = new UpdateBookingCommand(
        id,
        updateBookingDto,
      );
      mockBookingService.updateBooking.mockReturnValue(
        Promise.resolve(expectedResult),
      );

      const result = await bookingController.updateBooking(
        id,
        updateBookingDto,
      );

      expect(mockBookingService.updateBooking).toHaveBeenCalledWith(
        updateBookingCommand,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  /*   describe('deleteBooking', () => {
    it('should call deleteBooking with correct id and return the result', async () => {
      const id = '1';
      const expectedResult = { message: 'Booking deleted successfully' };

      mockBookingService.deleteBooking.mockResolvedValue(expectedResult);

      const result = await bookingController.deleteBooking(id);

      expect(mockBookingService.deleteBooking).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  }); */
});
