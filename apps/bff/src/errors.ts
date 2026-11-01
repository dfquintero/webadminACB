export class ApiFault extends Error {
  constructor(readonly statusCode: number, readonly code: string, message: string) {
    super(message);
  }
}

export const storageUnavailable = () => new ApiFault(503, 'SESSION_STORE_UNAVAILABLE', 'El servicio de sesión no está disponible.');
