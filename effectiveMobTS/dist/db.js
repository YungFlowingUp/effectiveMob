"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: './src/.env' });
const { Sequelize } = require('sequelize');
module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, { dialect: 'postgres', host: process.env.DB_HOST, port: process.env.DB_PORT });
