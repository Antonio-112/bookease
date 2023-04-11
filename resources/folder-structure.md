src/
├── application/
│ ├── booking/
│ │ ├── dto/
│ │ │ ├── create-booking.dto.ts
│ │ │ ├── update-booking.dto.ts
│ │ ├── commands/
│ │ │ ├── create-booking.command.ts
│ │ │ ├── update-booking.command.ts
│ │ │ └── delete-booking.command.ts
│ │ ├── queries/
│ │ │ ├── get-booking.query.ts
│ │ │ └── get-bookings.query.ts
│ │ ├── booking.module.ts
│ │ └── booking.controller.ts
│ ├── user/
│ │ ├── dto/
│ │ │ ├── create-user.dto.ts
│ │ │ ├── update-user.dto.ts
│ │ ├── commands/
│ │ │ ├── create-user.command.ts
│ │ │ ├── update-user.command.ts
│ │ │ └── delete-user.command.ts
│ │ ├── queries/
│ │ │ ├── get-user.query.ts
│ │ │ └── get-users.query.ts
│ │ ├── user.module.ts
│ │ └── user.controller.ts
├── domain/
│ ├── booking/
│ │ ├── booking.entity.ts
│ │ └── booking.repository.interface.ts
│ ├── user/
│ │ ├── user.entity.ts
│ │ └── user.repository.interface.ts
├── infrastructure/
│ ├── mongoose/
│ │ ├── booking/
│ │ │ ├── booking.schema.ts
│ │ │ └── booking.repository.ts
│ │ ├── user/
│ │ │ ├── user.schema.ts
│ │ │ └── user.repository.ts
├── app.module.ts
└── main.ts
