import { BookingModel } from './booking.schema';

export async function calculateTotalIncome(startDate: Date, endDate: Date): Promise<number> {
  const result = await BookingModel.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$price' },
      },
    },
  ]).exec();

  if (result.length > 0) {
    return result[0].totalIncome;
  }
  return 0;
}

export async function getHairdresserOccupancy(
  startDate: Date,
  endDate: Date,
): Promise<{ hairdresser: string; occupancy: number }[]> {
  const result = await BookingModel.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: '$hairdresser',
        occupancy: { $sum: 1 },
      },
    },
    {
      $project: {
        hairdresser: '$_id',
        occupancy: 1,
        _id: 0,
      },
    },
  ]).exec();

  return result.map((item: { hairdresser: string; occupancy: number }) => ({
    hairdresser: item.hairdresser,
    occupancy: item.occupancy,
  }));
}

export async function getBusiestDates(
  startDate: Date,
  endDate: Date,
  limit: number,
): Promise<{ date: Date; bookings: number }[]> {
  const result = await BookingModel.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { bookings: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        date: { $toDate: '$_id' },
        bookings: 1,
        _id: 0,
      },
    },
  ]).exec();

  return result.map((item: { date: Date; bookings: number }) => ({
    date: item.date,
    bookings: item.bookings,
  }));
}
