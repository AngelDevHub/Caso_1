import { Clock } from "../../usecases/proxy/EnrollmentServiceProxy"

export class SystemClock implements Clock {
  now(): Date {
    return new Date()
  }
}

