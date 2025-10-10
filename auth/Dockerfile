# Sử dụng một image Node.js chính thức làm base image
FROM node:18-alpine

# Tạo và chỉ định thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào thư mục làm việc
# Sử dụng dấu * để nó hoạt động dù có hoặc không có package-lock.json
COPY package*.json ./

# Cài đặt các dependencies của dự án
RUN npm install

# Sao chép toàn bộ mã nguồn còn lại vào thư mục làm việc
COPY . .

# Expose port mà ứng dụng sẽ chạy trên đó
# Bạn cần thay đổi port này cho phù hợp với từng service
# Ví dụ: auth là 3000, product là 3001, order là 3002
EXPOSE 3000

# Lệnh để khởi động ứng dụng
# Giả sử bạn có một script "start" trong package.json
CMD [ "npm", "start" ]