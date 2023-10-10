const express = require("./config/express");
const { logger } = require("./config/winston");
// 프로세스를 돌리면서 일어나는 에러들을 기록하는 로고

const port = 3000;
express().listen(port);
// 나는 express프레임워크를 실행한다는 의미
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
