import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Response status'
  })
  status: string;

  @ApiProperty({
    example: 'Operation completed successfully',
    description: 'Response message'
  })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code'
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error message'
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type'
  })
  error: string;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  access_token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token'
  })
  refresh_token: string;
} 