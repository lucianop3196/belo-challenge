
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();

            typeof message === 'object' ? message = message?.message : message

        } else if (axios.isAxiosError(exception)) {
            const err = exception as AxiosError;
            status = err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            message = err.message;

        } else if (exception instanceof Error) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;

        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Unknown error';
        }

        if (status == HttpStatus.INTERNAL_SERVER_ERROR) console.log("Error information:", message)

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: HttpStatus[status] || 'Error',
            message: status !== HttpStatus.INTERNAL_SERVER_ERROR ? message : 'Internal server error',
        });
    }
}
