export function BusinessLogicException(mensaje: string, codigo: number) {
  this.mensaje = mensaje;
  this.codigo = codigo;
}

export enum BusinessError {
  NOT_FOUND = 404,
  PRECONDITION_FAILED = 412,
  BAD_REQUEST = 400,
}