export class GetBookingByTimeRangeQuery {
  constructor(public readonly startTime: Date, public readonly endTime: Date) {}
}
