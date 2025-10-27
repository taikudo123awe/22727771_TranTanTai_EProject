# Hệ thống Microservices Quản lý Bán hàng (EProject-Phase-1)

Đây là một dự án mô phỏng hệ thống thương mại điện tử đơn giản được xây dựng theo kiến trúc Microservices, sử dụng Node.js, Express, MongoDB, và được container hóa bằng Docker.

## Mô tả kiến trúc

Hệ thống được chia thành các service độc lập, mỗi service đảm nhiệm một chức năng nghiệp vụ riêng biệt:

* **API Gateway**: Là cổng vào duy nhất cho tất cả các request từ client. Nó chịu trách nhiệm điều hướng request đến các service phù hợp.
* **Authentication Service**: Quản lý việc đăng ký, đăng nhập và xác thực người dùng bằng JWT (JSON Web Tokens).
* **Product Service**: Quản lý thông tin sản phẩm (CRUD), kiểm tra tồn kho, giá cả.
* **Order Service**: Xử lý logic đặt hàng, tạo và quản lý đơn hàng của người dùng.
# Test CI/CD trigger
### Giao tiếp giữa các Service
* **Giao tiếp đồng bộ (Synchronous):** Client giao tiếp với các service thông qua API Gateway bằng các request HTTP RESTful.
* **Giao tiếp bất đồng bộ (Asynchronous):** Hệ thống sử dụng **RabbitMQ** để các service có thể giao tiếp với nhau một cách không đồng bộ (ví dụ: `Order Service` thông báo cho `Product Service` cập nhật lại số lượng tồn kho sau khi một đơn hàng được tạo).

### Cơ sở dữ liệu
Dự án tuân thủ nguyên tắc **"Database per Service"**, mỗi service sẽ có một container database MongoDB hoàn toàn độc lập để đảm bảo sự tách biệt và tự chủ tối đa.

## Công nghệ sử dụng

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (với Mongoose ODM)
* **Message Broker:** RabbitMQ (với amqplib)
* **Containerization:** Docker, Docker Compose
* **Testing:** Mocha, Chai, Chai-Http

## Cấu trúc thư mục
```
.
├── api-gateway/      # Cấu hình API Gateway
├── auth/             # Source code của Authentication Service
├── order/            # Source code của Order Service
├── product/          # Source code của Product Service
├── .env              # File môi trường cho RabbitMQ (cần được tạo)
├── .gitignore        # File định nghĩa các file/thư mục Git sẽ bỏ qua
├── docker-compose.yml# File định nghĩa và liên kết các container
└── README.md         # Tài liệu mô tả dự án
```

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (thường đi kèm với Docker Desktop)
* [Git](https://git-scm.com/)

### Các bước thực hiện

1.  **Clone repository về máy:**
    ```bash
    git clone <your-repository-url>
    cd EProject-Phase-1
    ```

2.  **Thiết lập các file môi trường (.env):**
    Dự án này yêu cầu các file `.env` để lưu trữ các biến môi trường. Hãy tạo các file `.env` dựa trên các file `.env.example` dưới đây.

    * Tạo file `.env` ở **thư mục gốc**:
        ```env
        # .env
        RABBITMQ_USER=myuser
        RABBITMQ_PASS=mypassword
        ```

    * Tạo file `auth/.env`:
        ```env
        # auth/.env
        PORT=3000
        MONGODB_URI=mongodb://mongo-auth:27017/authdb
        JWT_SECRET=supersecretkey
        ```

    * Tạo file `product/.env`:
        ```env
        # product/.env
        PORT=3001
        MONGODB_URI=mongodb://mongo-product:27017/productdb
        RABBITMQ_URI=amqp://myuser:mypassword@rabbitmq:5672
        JWT_SECRET=supersecretkey
        ```

    * Tạo file `order/.env`:
        ```env
        # order/.env
        PORT=3002
        MONGODB_URI=mongodb://mongo-order:27017/orderdb
        RABBITMQ_URI=amqp://myuser:mypassword@rabbitmq:5672
        JWT_SECRET=supersecretkey
        ```

3.  **Khởi chạy toàn bộ hệ thống bằng Docker Compose:**
    Mở terminal tại thư mục gốc và chạy lệnh:
    ```bash
    docker-compose up --build -d
    ```
    * `--build`: Xây dựng các image nếu chúng chưa tồn tại.
    * `-d`: Chạy các container ở chế độ nền (detached mode).

4.  **Kiểm tra trạng thái các container:**
    ```bash
    docker ps
    ```
    Bạn sẽ thấy 8 container đang ở trạng thái `Up` (3 service, 3 DB, 1 RabbitMQ, 1 Gateway).

## Cách sử dụng

### API Endpoints

Tất cả các request đều đi qua API Gateway tại `http://localhost:3003`.

| Chức năng | Method | Endpoint | Yêu cầu xác thực |
| :--- | :--- | :--- | :--- |
| **Authentication** | | | |
| Đăng ký | `POST` | `/auth/register` | Không |
| Đăng nhập | `POST` | `/auth/login` | Không |
| **Products** | | | |
| Lấy tất cả sản phẩm | `GET` | `/products` | Có (Bearer Token) |
| Tạo sản phẩm mới | `POST` | `/products` | Có (Bearer Token) |
| **Orders** | | | |
| Tạo đơn hàng mới | `POST` | `/orders` | Có (Bearer Token) |
| Lấy các đơn hàng | `GET` | `/orders` | Có (Bearer Token) |

### Chạy Tests

Để chạy integration test cho một service cụ thể (ví dụ: `auth`):
1. Đảm bảo các container phụ thuộc đang chạy.
2. Mở terminal, đi vào thư mục của service đó.
3. Chạy lệnh test:
```bash
cd auth
npm test
```

---
**Tác giả:**
Trần Tấn Tài
