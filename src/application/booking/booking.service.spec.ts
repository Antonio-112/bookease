import { Test } from '@nestjs/testing';
import { IBookingRepository } from 'src/domain/booking/interfaces/booking.repository';
import { IUserRepository } from 'src/domain/user/interfaces/user.repository';
import { mock } from 'jest-mock-extended';
import { BookingService } from './booking.service';
import { Booking } from '../../domain/booking/booking.entity';
import { CreateBookingCommand } from './commands/create-booking.command';
import { User } from '../../domain/user/user.entity';
import { DeleteBookingCommand } from './commands/delete-booking.command';
// import { UpdateBookingCommand } from './commands/update-booking.command';
import { GetBookingQuery } from './queries/get-booking.query';
import { GetBookingsQuery } from './queries/get-bookings.query';

describe('BookingService', () => {
  let bookingService: BookingService;
  const mockBookingRepository = mock<IBookingRepository>();
  const mockUserRepository = mock<IUserRepository>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: 'IBookingRepository', useValue: mockBookingRepository },
        { provide: 'IUserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isTimeSlotAvailable', () => {
    it('should return true when time slot is available', async () => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const hairdresser = 'Test Hairdresser';

      mockBookingRepository.findByHairdresserAndTimeRange.mockResolvedValue([]);

      const result = await bookingService.isTimeSlotAvailable(
        date,
        hairdresser,
      );

      expect(
        mockBookingRepository.findByHairdresserAndTimeRange,
      ).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when time slot is not available', async () => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const hairdresser = 'Test Hairdresser';

      const existingBooking = new Booking(
        '1',
        'Test Name',
        date,
        hairdresser,
        'confirmed',
      );

      mockBookingRepository.findByHairdresserAndTimeRange.mockResolvedValue([
        existingBooking,
      ]);

      const result = await bookingService.isTimeSlotAvailable(
        date,
        hairdresser,
      );

      expect(
        mockBookingRepository.findByHairdresserAndTimeRange,
      ).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when time is outside business hours', async () => {
      const date = new Date();
      date.setHours(8, 0, 0, 0); // Before 9 AM
      const hairdresser = 'Test Hairdresser';

      const result = await bookingService.isTimeSlotAvailable(
        date,
        hairdresser,
      );

      expect(result).toBe(false);
    });
  });

  describe('createBooking', () => {
    it('should create a new booking and return the result', async () => {
      const createBookingDto = {
        name: 'Test Name',
        date: new Date(),
        hairdresser: 'Test Hairdresser',
        status: 'confirmed',
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
      );

      jest.spyOn(bookingService, 'isTimeSlotAvailable').mockResolvedValue(true);
      mockBookingRepository.create.mockResolvedValue(expectedResult);
      mockUserRepository.findByName.mockResolvedValue(user);

      const result = await bookingService.createBooking(command);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith(
        createBookingDto.name,
      );
      expect(mockBookingRepository.create).toHaveBeenCalledWith(
        expect.any(Booking),
      );
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
          'confirmed',
        ),
        new Booking(
          '2',
          'Test Name 2',
          new Date(),
          'Test Hairdresser',
          'confirmed',
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
        'confirmed',
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
