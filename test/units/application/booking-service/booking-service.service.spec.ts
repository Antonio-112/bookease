import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { BookingServicesService } from '../../../../src/application/booking-service/booking-services.service';
import {
  CreateBookingServiceCommand,
  GetBookingServicesQuery,
  GetBookingServiceQuery,
  UpdateBookingServiceCommand,
  DeleteBookingServiceCommand,
} from '../../../../src/application/booking-service/cqrs';
import { BookingServices } from '../../../../src/domain/booking-service/booking-service.entity';
import { IBookingServiceRepository } from '../../../../src/domain/booking-service/interfaces/booking-service.repository';

describe('BookingServicesService', () => {
  let service: BookingServicesService;
  let bookingServiceRepository: MockProxy<IBookingServiceRepository>;

  beforeEach(async () => {
    bookingServiceRepository = mock<IBookingServiceRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingServicesService, { provide: 'IBookingServiceRepository', useValue: bookingServiceRepository }],
    }).compile();

    service = module.get<BookingServicesService>(BookingServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking service', async () => {
      const command = new CreateBookingServiceCommand({
        name: 'Test Service',
        details: 'Test Details',
        price: 100,
        duration: 60,
      });

      await service.create(command);
      expect(bookingServiceRepository.create).toHaveBeenCalledWith(expect.any(BookingServices));
    });
  });

  describe('findAll', () => {
    it('should return an array of booking services', async () => {
      const query = new GetBookingServicesQuery();
      await service.findAll(query);
      expect(bookingServiceRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a booking service', async () => {
      const query = new GetBookingServiceQuery('1');
      await service.findById(query);
      expect(bookingServiceRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a booking service', async () => {
      const command = new UpdateBookingServiceCommand('1', {
        name: 'Updated Service',
        details: 'Updated Details',
        price: 150,
        duration: 90,
      });

      await service.update(command);
      expect(bookingServiceRepository.update).toHaveBeenCalledWith('1', expect.any(BookingServices));
    });
  });

  describe('delete', () => {
    it('should delete a booking service', async () => {
      const command = new DeleteBookingServiceCommand('1');
      await service.delete(command);
      expect(bookingServiceRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
