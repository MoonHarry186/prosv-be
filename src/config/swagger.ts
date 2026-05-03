import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProSV API',
      version: '1.0.0',
      description: 'Educational Course Management System API',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TokenPair: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            refresh_token: { type: 'string' },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            is_verified: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuthResult: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/AuthUser' },
            tokens: { $ref: '#/components/schemas/TokenPair' },
          },
        },
        ScheduleSlot: {
          type: 'object',
          required: ['day', 'start_time', 'end_time'],
          properties: {
            day: { type: 'string', enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
            start_time: { type: 'string', example: '08:00' },
            end_time: { type: 'string', example: '10:00' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            course_name: { type: 'string' },
            course_code: { type: 'string' },
            instructor_name: { type: 'string' },
            credits: { type: 'integer' },
            semester: { type: 'string' },
            academic_year: { type: 'string' },
            schedule: { type: 'array', items: { $ref: '#/components/schemas/ScheduleSlot' } },
            color: { type: 'string', example: '#FF5733' },
            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
          },
        },
        Assignment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            course_id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            deadline: { type: 'string', format: 'date-time' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'overdue'] },
            notes: { type: 'string' },
          },
        },
        PomodoroSession: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            course_id: { type: 'string' },
            assignment_id: { type: 'string' },
            work_minutes: { type: 'integer' },
            break_minutes: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'paused', 'cancelled', 'completed'] },
            completed_cycles: { type: 'integer' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            assignment_id: { type: 'string' },
            notify_before: { type: 'integer' },
            enabled: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng ký tài khoản',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'full_name'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    full_name: { type: 'string', minLength: 2, maxLength: 100 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Đăng ký thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } } } },
            400: { description: 'Dữ liệu không hợp lệ', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đăng nhập thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } } } },
            401: { description: 'Sai email hoặc mật khẩu' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Làm mới access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refresh_token'],
                  properties: { refresh_token: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Token mới', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenPair' } } } },
            401: { description: 'Refresh token không hợp lệ' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng xuất',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Đăng xuất thành công' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Lấy thông tin người dùng hiện tại',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Thông tin user', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthUser' } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/auth/google': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập bằng Google',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id_token'],
                  properties: { id_token: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đăng nhập thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } } } },
            401: { description: 'Token không hợp lệ' },
          },
        },
      },
      '/auth/facebook': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập bằng Facebook',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['access_token'],
                  properties: { access_token: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đăng nhập thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } } } },
            401: { description: 'Token không hợp lệ' },
          },
        },
      },
      '/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Lấy thông tin hồ sơ',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Hồ sơ người dùng', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthUser' } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Cập nhật hồ sơ',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    full_name: { type: 'string', minLength: 2, maxLength: 100 },
                    notifications_enabled: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
            400: { description: 'Dữ liệu không hợp lệ' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/users/password': {
        patch: {
          tags: ['Users'],
          summary: 'Đổi mật khẩu',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['current_password', 'new_password'],
                  properties: {
                    current_password: { type: 'string' },
                    new_password: { type: 'string', minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đổi mật khẩu thành công' },
            400: { description: 'Mật khẩu hiện tại không đúng' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/users/fcm-token': {
        post: {
          tags: ['Users'],
          summary: 'Cập nhật FCM token cho push notification',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fcm_token'],
                  properties: { fcm_token: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/courses': {
        post: {
          tags: ['Courses'],
          summary: 'Tạo môn học mới',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['course_name', 'course_code', 'credits', 'semester', 'academic_year'],
                  properties: {
                    course_name: { type: 'string', maxLength: 200 },
                    course_code: { type: 'string', maxLength: 20 },
                    instructor_name: { type: 'string', maxLength: 100 },
                    credits: { type: 'integer', minimum: 1, maximum: 10 },
                    semester: { type: 'string' },
                    academic_year: { type: 'string' },
                    schedule: { type: 'array', items: { $ref: '#/components/schemas/ScheduleSlot' } },
                    color: { type: 'string', example: '#FF5733' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
            400: { description: 'Dữ liệu không hợp lệ' },
            401: { description: 'Chưa xác thực' },
          },
        },
        get: {
          tags: ['Courses'],
          summary: 'Danh sách môn học',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Danh sách môn học', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/courses/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Chi tiết môn học',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Chi tiết môn học', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
        patch: {
          tags: ['Courses'],
          summary: 'Cập nhật môn học',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    course_name: { type: 'string' },
                    course_code: { type: 'string' },
                    instructor_name: { type: 'string' },
                    credits: { type: 'integer', minimum: 1, maximum: 10 },
                    semester: { type: 'string' },
                    academic_year: { type: 'string' },
                    schedule: { type: 'array', items: { $ref: '#/components/schemas/ScheduleSlot' } },
                    color: { type: 'string' },
                    status: { type: 'string', enum: ['active', 'completed', 'archived'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
            400: { description: 'Dữ liệu không hợp lệ' },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
        delete: {
          tags: ['Courses'],
          summary: 'Xóa môn học',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Xóa thành công' },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/assignments': {
        post: {
          tags: ['Assignments'],
          summary: 'Tạo bài tập mới',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['course_id', 'title', 'deadline'],
                  properties: {
                    course_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    title: { type: 'string', maxLength: 200 },
                    description: { type: 'string', maxLength: 2000 },
                    deadline: { type: 'string', format: 'date-time' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    notes: { type: 'string', maxLength: 2000 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } },
            400: { description: 'Dữ liệu không hợp lệ' },
            401: { description: 'Chưa xác thực' },
          },
        },
        get: {
          tags: ['Assignments'],
          summary: 'Danh sách bài tập',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Danh sách bài tập', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/assignments/{id}': {
        get: {
          tags: ['Assignments'],
          summary: 'Chi tiết bài tập',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Chi tiết bài tập', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
        patch: {
          tags: ['Assignments'],
          summary: 'Cập nhật bài tập',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    deadline: { type: 'string', format: 'date-time' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'overdue'] },
                    notes: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
        delete: {
          tags: ['Assignments'],
          summary: 'Xóa bài tập',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Xóa thành công' },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/assignments/{id}/complete': {
        patch: {
          tags: ['Assignments'],
          summary: 'Đánh dấu bài tập hoàn thành',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/pomodoro/sessions': {
        post: {
          tags: ['Pomodoro'],
          summary: 'Tạo phiên Pomodoro mới',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    course_id: { type: 'string' },
                    assignment_id: { type: 'string' },
                    work_minutes: { type: 'integer', minimum: 1, maximum: 120 },
                    break_minutes: { type: 'integer', minimum: 1, maximum: 60 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/PomodoroSession' } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
        get: {
          tags: ['Pomodoro'],
          summary: 'Danh sách phiên Pomodoro',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Danh sách phiên', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PomodoroSession' } } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/pomodoro/sessions/{id}': {
        get: {
          tags: ['Pomodoro'],
          summary: 'Chi tiết phiên Pomodoro',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Chi tiết phiên', content: { 'application/json': { schema: { $ref: '#/components/schemas/PomodoroSession' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
        patch: {
          tags: ['Pomodoro'],
          summary: 'Cập nhật phiên Pomodoro',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['active', 'paused', 'cancelled'] },
                    completed_cycles: { type: 'integer', minimum: 0 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/PomodoroSession' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/pomodoro/sessions/{id}/complete': {
        patch: {
          tags: ['Pomodoro'],
          summary: 'Hoàn thành phiên Pomodoro',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/PomodoroSession' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/notifications/schedule': {
        post: {
          tags: ['Notifications'],
          summary: 'Đặt lịch nhắc nhở bài tập',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['assignment_id', 'notify_before'],
                  properties: {
                    assignment_id: { type: 'string' },
                    notify_before: { type: 'integer', minimum: 1, description: 'Số phút trước deadline để nhắc' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Đặt lịch thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Notification' } } } },
            400: { description: 'Dữ liệu không hợp lệ' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Danh sách thông báo',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Danh sách thông báo', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Notification' } } } } },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/notifications/{id}/toggle': {
        patch: {
          tags: ['Notifications'],
          summary: 'Bật/tắt thông báo',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Cập nhật thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/Notification' } } } },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/notifications/{id}': {
        delete: {
          tags: ['Notifications'],
          summary: 'Xóa thông báo',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Xóa thành công' },
            404: { description: 'Không tìm thấy' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/statistics/overview': {
        get: {
          tags: ['Statistics'],
          summary: 'Tổng quan thống kê',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dữ liệu tổng quan' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/statistics/by-course': {
        get: {
          tags: ['Statistics'],
          summary: 'Thống kê theo môn học',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Thống kê theo môn' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/statistics/daily': {
        get: {
          tags: ['Statistics'],
          summary: 'Thống kê hàng ngày',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Thống kê hàng ngày' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
      '/statistics/streaks': {
        get: {
          tags: ['Statistics'],
          summary: 'Chuỗi ngày học liên tiếp',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dữ liệu streak' },
            401: { description: 'Chưa xác thực' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
