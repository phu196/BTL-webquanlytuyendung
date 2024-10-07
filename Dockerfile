FROM node:16

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường
ENV PORT=3000

# Expose port
EXPOSE 3000

# Chạy ứng dụng
CMD [ "npm", "start" ]