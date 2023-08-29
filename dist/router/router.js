"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json()); // mapea la inf en formato json
app.use(express_1.default.urlencoded({ extended: true })); // en url
exports.default = router;
