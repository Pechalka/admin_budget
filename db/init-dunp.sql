

DROP TABLE IF EXISTS `budget_fields`;
CREATE TABLE `budget_fields` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) NOT NULL,
  `field` varchar(256)  NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `app_category`;
CREATE TABLE `app_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `parentId` bigint(20) DEFAULT 0,
  `budgetId` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `budget_item`;
CREATE TABLE `budget_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20)  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
