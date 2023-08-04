import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import config from "../config";

const { combine, timestamp, label, printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${JSON.stringify(message)}`;
});

const fileRotateTransport = (dirname: string, serverName: string) =>
	new transports.DailyRotateFile(
		{
			filename: `${serverName}-%DATE%.log`,
			dirname,
			level: "info",
			handleExceptions: true,
			json: false,
			zippedArchive: true,
			maxFiles: "14d",
		} || {}
	);

const errRotateTransport = (dirname: string, serverName: string) =>
	new transports.DailyRotateFile(
		{
			filename: `${serverName}-%DATE%.error.log`,
			dirname,
			level: "error",
			handleExceptions: true,
			json: false,
			zippedArchive: true,
			maxFiles: "14d",
		} || {}
	);

const getLogger = (serverName: string, dirName: string) =>
	createLogger({
		level: "info",
		format: combine(
			label({ label: serverName }),
			timestamp({
				format: "MM-DD-YYYY HH:mm:ss",
			}),
			customFormat
		),
		transports: [
			new transports.Console(),
			fileRotateTransport(dirName, serverName),
			errRotateTransport(dirName, serverName),
		],
		exitOnError: false,
	});

export default getLogger(config.serverName, config.log.dirName);
