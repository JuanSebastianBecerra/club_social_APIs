/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../../compartido/errores/errores-de-negocio';

@Injectable()
export class ErroresDeNegocioInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        if (error.codigo === BusinessError.NOT_FOUND)
          throw new HttpException({mensaje: error.mensaje, codigo: BusinessError.NOT_FOUND}, HttpStatus.NOT_FOUND);
        else if (error.codigo === BusinessError.PRECONDITION_FAILED)
          throw new HttpException({mensaje: error.mensaje, codigo: BusinessError.PRECONDITION_FAILED}, HttpStatus.PRECONDITION_FAILED);
        else if (error.codigo === BusinessError.BAD_REQUEST)
          throw new HttpException({mensaje: error.mensaje, codigo: BusinessError.BAD_REQUEST}, HttpStatus.BAD_REQUEST);
        else
          throw error;
      }));
  }
}
