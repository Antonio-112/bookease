src/
├── application/
│ ├── auth/
│ │ ├── cqrs/
│ │ │ ├── dto/
│ │ │ │ ├── index.ts
│ │ │ │ ├── login.dto.ts
│ │ │ │ └── register.dto.ts
│ │ │ ├── commands/
│ │ │ │ ├── index.ts
│ │ │ │ ├── create-register.command.ts
│ │ │ ├── queries/
│ │ │ │ ├── index.ts
│ │ │ │ ├── get-login.query.ts
│ │ ├── guards/
│ │ │ ├── jwt-auth.guard.ts
│ │ ├── strategies/
│ │ │ ├── jwt.strategy.ts
│ │ ├── auth.module.ts
│ │ ├── auth.service.ts
│ │ └── auth.controller.ts
│ ├── booking/
│ │ ├── cqrs/
│ │ │ ├── dto/
│ │ │ │ ├── create-booking.dto.ts
│ │ │ │ ├── index.ts
│ │ │ │ └── update-booking.dto.ts
│ │ │ ├── commands/
│ │ │ │ ├── create-booking.command.ts
│ │ │ │ ├── delete-booking.command.ts
│ │ │ │ ├── index.ts
│ │ │ │ └── update-booking.command.ts
│ │ │ ├── queries/
│ │ │ │ ├── get-booking.query.ts
│ │ │ │ ├── get-bookings.query.ts
│ │ │ │ └── index.ts
│ │ ├── booking.module.ts
│ │ ├── booking.service.ts
│ │ └── booking.controller.ts
│ ├── user/
│ │ ├── cqrs/
│ │ │ ├── dto/
│ │ │ │ ├── create-user.dto.ts
│ │ │ │ ├── index.ts
│ │ │ │ └── update-user.dto.ts
│ │ │ ├── commands/
│ │ │ │ ├── create-user.command.ts
│ │ │ │ ├── delete-user.command.ts
│ │ │ │ ├── index.ts
│ │ │ │ └── update-user.command.ts
│ │ │ ├── queries/
│ │ │ │ ├── get-user.query.ts
│ │ │ │ ├── get-users.query.ts
│ │ │ │ └── index.ts
│ │ ├── user.module.ts
│ │ ├── user.service.ts
│ │ └── user.controller.ts
├── domain/
│ ├── booking/
│ │ ├── booking.entity.ts
│ │ └── booking.repository.interface.ts
│ ├── user/
│ │ ├── user.entity.ts
│ │ └── user.repository.interface.ts
│ ├── login-attempt/
│ │ ├── login-attempt.entity.ts
│ │ └── login-attempt.repository.interface.ts
├── infrastructure/
│ ├── mongo/
│ │ ├── booking/
│ │ │ ├── booking.schema.ts
│ │ │ └── booking.repository.ts
│ │ ├── user/
│ │ │ ├── user.schema.ts
│ │ │ └── user.repository.ts
│ │ ├── login-attempt/
│ │ │ ├── login-attempt.schema.ts
│ │ │ └── login-attempt.repository.ts
│ │ ├── mongo.module.ts
├── app.module.ts
└── main.ts
