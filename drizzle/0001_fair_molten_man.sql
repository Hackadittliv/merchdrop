CREATE TABLE `merchdrop_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`channel` text,
	`description` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`confirmationSentAt` timestamp,
	`followupSentAt` timestamp,
	`isContacted` int NOT NULL DEFAULT 0,
	CONSTRAINT `merchdrop_leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `merchdrop_leads_email_unique` UNIQUE(`email`)
);
