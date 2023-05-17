import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { Logger } from '@nestjs/common';
import { BookingServiceController } from '../../../../src/application/booking-service/booking-services.controller';
import { BookingServicesService } from '../../../../src/application/booking-service/booking-services.service';
import { CreateBookingServiceDto, UpdateBookingServiceDto } from '../../../../src/application/booking-service/cqrs';

describe('BookingServiceController', () => {
  let controller: BookingServiceController;
  let bookingService: MockProxy<BookingServicesService>;

  beforeEach(async () => {
    bookingService = mock<BookingServicesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingServiceController],
      providers: [{ provide: BookingServicesService, useValue: bookingService }],
    }).compile();

    controller = module.get<BookingServiceController>(BookingServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking service', async () => {
      const dto: CreateBookingServiceDto = {
        name: 'Test Service',
        details: 'Test Details',
        price: 100,
        duration: 60,
      };
      await controller.create(dto);
      expect(bookingService.create).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('findAll', () => {
    it('should return an array of booking services', async () => {
      await controller.findAll();
      expect(bookingService.findAll).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('findById', () => {
    it('should return a booking service', async () => {
      await controller.findById('1');
      expect(bookingService.findById).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('update', () => {
    it('should update a booking service', async () => {
      const dto: UpdateBookingServiceDto = {
        name: 'Updated Service',
        details: 'Updated Details',
        price: 150,
        duration: 90,
      };
      await controller.update('1', dto);
      expect(bookingService.update).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('delete', () => {
    it('should delete a booking service', async () => {
      await controller.delete('1');
      expect(bookingService.delete).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
