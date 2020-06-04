-- Removing reliability statistics as it is more project specific
DELETE FROM `StatisticsTabs`  WHERE `SubModuleName`='stats_reliability';